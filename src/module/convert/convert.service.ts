import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../notifications/email/email.service';
import * as fs from 'fs';
import * as archiver from 'archiver';
import { Cluster } from 'puppeteer-cluster';
import { execSync } from 'child_process';
import { ISendMailOptions } from '@nestjs-modules/mailer';

@Injectable()
export class ConvertService {
  constructor(public readonly configService: ConfigService, private readonly emailService: EmailService) {}

  // 업로드한 파일을 저장한다.
  async uploadFile(email: string, file: any): Promise<any> {
    try {
      // 작업을 진행할 폴더를 생성한다. 폴더명은 이메일_현시각_UUID
      const uploadFilePath = `resource/${email}_${Date.now()}`;

      // uploads 폴더가 존재하지 않을시,
      if (!fs.existsSync(uploadFilePath)) {
        // 생성합니다.
        fs.mkdirSync(uploadFilePath, { recursive: true });
      }
      // // 파일 이름은 기존 이름
      // const fileName = file.originalname.replace(' ', '_');

      // 파일 이름은 html
      const fileName = 'html.zip';

      // 파일 업로드 경로
      const uploadPath = `${uploadFilePath}/${fileName}`;

      //파일 생성
      fs.writeFileSync(uploadPath, file.buffer); // file.path 임시 파일 저장소

      return { fileName, uploadPath };
    } catch (err) {
      await this.sendFailMail(email, `파일 업로드가 불가능합니다, \n ${err}`);
      throw new BadRequestException('파일 업로드가 불가능합니다.');
    }
  }

  // 경로에서 파일을 읽어서 압축을 해제한다.
  async unzipFile(zipFilePath: string, email: string): Promise<string> {
    try {
      // 압축 해제 경로
      const unzipPath = zipFilePath.replace('.zip', '');

      // 압축 해제 경로가 존재하지 않을시,
      if (!fs.existsSync(unzipPath)) {
        // 생성합니다.
        fs.mkdirSync(unzipPath, { recursive: true });
      }

      // 압축 해제 execSync
      const unzipExec = `unzip -UU -d ${unzipPath} ${zipFilePath}`;
      // const unzipExec = `7z x ${zipFilePath} -o${unzipPath} -aoa`;
      execSync(unzipExec);

      // 압축 해제된 파일 경로를 반환합니다.
      return unzipPath;
    } catch (err) {
      await this.sendFailMail(email, `파일 압축 해제가 불가능합니다, \n ${err}`);
      throw new BadRequestException('파일 압축 해제가 불가능합니다.');
    }
  }

  // 경로에서 HTML파일 목록을 읽어서 PDF로 변환한다.
  async puppeteerConvertCluster(unzipPath: string, email: string): Promise<string> {
    try {
      // 레포트 결과 폴더가 있다면 파일 리스트를 가져온다
      const originalFilePathList = fs.readdirSync(unzipPath, {
        encoding: 'utf8',
        recursive: true,
      });
      // 파일 리스트가 없다면
      if (originalFilePathList.length === 0) {
        throw new BadRequestException('압축파일 내부에 HTML이 존재하지 않습니다.');
      }

      const workDir = unzipPath.split('/')[1];
      // PDF 저장 경로
      const savePath = `resource/${workDir}/pdf`;

      // 경로가 존재하지 않는다면
      if (!fs.existsSync(savePath)) {
        // create directory
        fs.mkdirSync(savePath, { recursive: true });
      }

      // Puppeteer Cluster 생성
      const puppeteerCluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 100,
        puppeteerOptions: {
          executablePath: '/usr/bin/firefox',
          product: 'firefox',
        },
      });

      // 클러스터 작업 생성
      await puppeteerCluster.task(async ({ page, data }) => {
        // 페이지 생성
        await page.setContent(data.html);

        // 1.5초 대기 (페이지 로딩 대기)
        new Promise((res) => setTimeout(res, 2000));

        // PDF 생성
        await page.pdf({
          path: `${savePath}/${data.fileName.replace('html', 'pdf')}`,
          format: 'A4',
          printBackground: true,
          scale: 0.99,
        });
      });

      // 클러스터에 작업 추가
      await Promise.all(
        originalFilePathList.map(async (fileName: string) => {
          const filePath = unzipPath + '/' + fileName;
          const html = fs.readFileSync(filePath, { encoding: 'utf8' });
          await puppeteerCluster.queue({ html, fileName });
        }),
      );

      // 변환 작업이 종료되면 클러스터를 종료한다.
      await puppeteerCluster.idle();
      await puppeteerCluster.close();

      // PDF 저장 경로를 반환한다.
      return savePath;
    } catch (err) {
      await this.sendFailMail(email, `HTML to PDF 변환에 실패했습니다, \n ${err}`);
      throw new BadRequestException('HTML to PDF 변환에 실패했습니다.');
    }
  }

  // 경로를 압축한다.
  async zipDir(outPath: string, zipFileDir: string, email: string): Promise<string> {
    try {
      // 압축 파일 경로
      const zipOutput = fs.createWriteStream(outPath);

      // 압축 파일 생성
      const zipArchive = archiver('zip', { store: true });

      // 압축 파일 경로를 반환한다.
      zipArchive.pipe(zipOutput);

      // 압축 파일에 경로를 추가한다.
      zipArchive.directory(zipFileDir, false);

      // 압축 종료
      await zipArchive.finalize();

      // 압축 파일 경로를 반환한다.
      return outPath;
    } catch (err) {
      await this.sendFailMail(email, `PDF 압축에 실패했습니다, \n ${err}`);
      throw new BadRequestException('PDF 압축에 실패했습니다.');
    }
  }

  async convertHTMLzip2PDF(host: string, email: string, file: any): Promise<any> {
    // 파일 업로드
    const { uploadPath } = await this.uploadFile(email, file);

    // 파일 압축 해제
    const unzipPath = await this.unzipFile(uploadPath, email);

    // HTML -> PDF 변환
    const savePath = await this.puppeteerConvertCluster(unzipPath, email);

    const zipOutPath = `${uploadPath.split('/')[0]}/${uploadPath.split('/')[1]}/converted_pdf.zip`;
    // PDF 압축
    const zipFilePath = await this.zipDir(zipOutPath, savePath, email);
    console.log(zipFilePath);

    // 이메일 전송
    const emailOptions: ISendMailOptions = {
      to: email,
      subject: 'HTML to PDF 변환 결과',
      text: 'HTML to PDF 변환 결과입니다.' + `\n\n\n\n` + `https://${host}/${zipFilePath}`,
    };
    await this.emailService.sendEmail(emailOptions);
  }

  async sendFailMail(email: string, message: string): Promise<void> {
    const emailOptions: ISendMailOptions = {
      to: email,
      subject: 'HTML to PDF 변환 실패',
      text: `HTML to PDF 변환 실패입니다. 다시 시도해주세요.` + `\n\n\n` + `${message}`,
    };
    await this.emailService.sendEmail(emailOptions);
  }
}
