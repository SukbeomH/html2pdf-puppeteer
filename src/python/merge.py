import PyPDF2
import sys
import os

def merge(path, name):
    merged_pdf = PyPDF2.PdfMerger()

    # pdf_files = ["/myfolder/resource/test/file1.pdf", "/myfolder/resource/test/file2.pdf", "/myfolder/resource/test/file3.pdf", "/myfolder/resource/test/file4.pdf"]
    pdf_files = os.listdir(path + "html/")
    
    for pdf_file in pdf_files:
        print(path + pdf_file)
        merged_pdf.append(path + "html/" + pdf_file)

    # merged_pdf.write("/myfolder/resource/test/merged.pdf")
    merged_pdf.write(path + "merged/" + name)

    merged_pdf.close()

if __name__ == '__main__':
    merge(sys.argv[1], sys.argv[2])