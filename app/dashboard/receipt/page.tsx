"use client"
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import { excelToArray } from './excelToArray';
import Image from 'next/image';
import JSZip from 'jszip';
import { PDFDocument, rgb } from 'pdf-lib';

const UploadExcel: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any[][] | null>(null);
  const contentRef = useRef(null);
  const [jsonData, setJsonData] = useState<any>([]);
  var data: any[] | React.SetStateAction<null> = []
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (evt) => {

        if (evt.target) {
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          data = XLSX.utils.sheet_to_json(ws);
          // const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          console.log("data", data);
          setJsonData(data);
          console.log("jsonData", jsonData)
        }
      };
      reader.readAsBinaryString(file);
      if (event.target.files && event.target.files.length > 0) {
        setSelectedFile(event.target.files[0]);
      }
    }
  };

  // const generatePDF = () => {
  //   const element = document.getElementById('divToPrint');
  //   html2pdf().from(element).save();
  // };

  const handleUpload = async () => {
    generatePDF();
    // const pdfPromises: Promise<Blob>[] = [];
    // const zip = new JSZip();
    // for (let i = 0; i < jsonData.length; i++) {
    //   const element = document.getElementById(i + 'id');
    //   const options = {
    //     filename: jsonData[i].Receipt + "-" + jsonData[i].Name + '.pdf', // Specify the desired filename here
    //   };
    //   html2pdf().from(element).set(options).save();
    // }
  };

  //  new mwthod
  const generatePDF = async () => {
    const pdfPromises: Promise<Blob>[] = [];
    const zip = new JSZip();

    // Array of HTML elements or strings to convert to PDFs
    const contentToConvert = ['<h1>PDF 1</h1>', '<h1>PDF 2</h1>'];

    for (let i = 0; i < jsonData.length; i++) {
      const element = document.getElementById(i + 'id');
      const pdfPromise = html2pdf().from(element).toPdf().output('blob');
      pdfPromises.push(pdfPromise);

      // Add PDF to zip
      pdfPromise.then((pdfBlob: null) => {
        zip.file(jsonData[i].Receipt + "-" + jsonData[i].Name + ".pdf", pdfBlob);
      });
      // Generate PDF from HTML
      // const pdfPromise = html2pdf().from(element).toPdf().get('pdf');
      // pdfPromises.push(pdfPromise);

      // // Add PDF to zip
      // pdfPromise.then((pdf: null) => {
      //   zip.file(`pdf_${i + 1}.pdf`, pdf);
      // });
    };

    // Generate zip folder once all PDFs are generated
    Promise.all(pdfPromises).then(() => {
      zip.generateAsync({ type: 'blob' }).then(content => {
        const zipBlob = new Blob([content], { type: 'application/zip' });
        const zipUrl = URL.createObjectURL(zipBlob);

        // Create a link to download the zip
        const link = document.createElement('a');
        link.href = zipUrl;
        link.download = 'pdfs.zip';
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(zipUrl);
      });
    });
  };




  return (
    <div className="mt-6 flow-root">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
      />
      <button className="p-3 items-center rounded-lg bg-violet-600 px-4 text-sm font-medium text-white transition-colors hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
        onClick={handleUpload}>Download Pdf</button>
      <button className="ml-5 mb-10 p-3 items-center rounded-lg bg-violet-600 px-4 text-sm font-medium text-white transition-colors hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
        onClick={handleUpload}>Whatsapp Push</button>
      {jsonData && jsonData[0] && (
        <div>

          {/* <table>
            <tbody ref={contentRef}>
              {jsonData.map((item: any, index: any) => (
                <tr key={index}>
                  <td>{item.number}</td>
                  <td>{item.Receipt}</td>
                  <td>{item.Name}</td>
                  <td>{item.Date}</td>
                  <td>{item.Heading}</td>
                  <td>{item.Description}</td>
                  <td>{item.Amount}</td>
                  <td>{item.Mode}</td>
                  <td>{item.Mobile}</td>
                </tr>
              ))}
            </tbody>
          </table> */}
          <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
              <div className="rounded-lg bg-violet-400 p-2 md:pt-0">

                <table className="hidden min-w-full text-gray-900 md:table">
                  <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                    <th scope="col" className="px-3 py-5 font-medium">
                        Sr. No.
                      </th>
                      <th scope="col" className="px-3 py-5 font-medium">
                        Receipt No.
                      </th>
                      <th scope="col" className="px-3 py-5 font-medium">
                        Date
                      </th>
                      <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                        Member
                      </th>
                      <th scope="col" className="px-3 py-5 font-medium">
                        Received towards
                      </th>
                      <th scope="col" className="px-3 py-5 font-medium">
                        Amount
                      </th>
                      <th scope="col" className="px-3 py-5 font-medium">
                        Mobile No.
                      </th>
                      <th scope="col" className="relative py-3 pl-6 pr-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {jsonData?.map((invoice: any, index: any) => (
                      <tr
                        key={index}
                        className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                      >
                        <td className="whitespace-nowrap px-3 py-3">
                          {invoice.number}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          {invoice.Receipt}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          {invoice.Date}
                        </td>
                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                          <div className="flex items-center gap-3">
                            {/* <Image
                            src={invoice.image_url}
                            className="rounded-full"
                            width={28}
                            height={28}
                            alt={`${invoice.name}'s profile picture`}
                          /> */}
                            <p>{invoice.Name}</p>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          {invoice.Heading}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          Rs. {invoice.Amount}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          Rs. {invoice.Mobile}
                        </td>
                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                          <div className="flex justify-end gap-3">
                            {/* <UpdateInvoice id={invoice.id} />
                          <DeleteInvoice id={invoice.id} /> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>
          </div>

        </div >

      )}
      {jsonData.map((item: any, index: any) => (
        <div key={index} id={index + "id"} className="bg-gray-100 border-4  border-violet-500/75 rounded-3xl shadow-2xl px-6 py-8 max-w-md mx-auto mt-8">
          <Image
            src="/vmmtc-logo.png"
            className='mx-auto'
            alt="Vmmtc"
            width={100}
            height={100}
          />
          <h1 className="font-bold text-2xl my-4 text-center text-violet-600">Methodist Tamil Church, Kalyan</h1>
          <div className="text-gray-700 text-center ">Opp. State Bank of India, Murbad road,</div>
          <div className="text-gray-700 text-center mb-10">Kalyan (W) - 421301</div>
          <div className="flex justify-between mb-6">
            <h1 className="text-lg font-bold">Receipt no.: {item.Receipt}</h1>
            <div className="text-gray-700">
              <div>Date: {item.Date}</div>
              {/* <div>Invoice #: INV12345</div> */}
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">Received from: {item.Title} {item.Name}</h2>
            <div className="text-violet-700 mb-2"></div>
            {/* <div className="text-gray-700 mb-2">123 Main St.</div>
            <div className="text-gray-700 mb-2">Anytown, USA 12345</div>
            <div className="text-gray-700">johndoe@example.com</div> */}
          </div>
          <table className="w-full mb-8">
            <thead>
              <tr>
                <th className="text-left font-bold text-gray-700 mb-6">Received towards</th>
                <th className="text-right font-bold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-left text-gray-700">{item.Heading}</td>
                <td className="text-right text-gray-700">Rs. {item.Amount}</td>
              </tr>
              <tr>
                <td className="text-wrap pr-20 text-left text-gray-700 text-xs italic mb-10">({item.Description})</td>
              </tr>
              {/* <tr>
                <td className="text-left font-bold text-gray-500">Payment mode</td>
                <td className="text-right font-bold text-gray-500 italic">{item.Mode}</td>
              </tr> */}
            </tbody>
            <tfoot>
              {/* <tr>
                <td className="text-left font-bold text-gray-500">Payment mode</td>
                <td className="text-right font-bold text-gray-500 italic">{item.Mode}</td>
              </tr> */}
            </tfoot>
          </table>
          <div className="text-gray-500 font-bold text-center mb-8">Payment mode: {item.Mode}</div>
          <div className="text-gray-700 text-center mb-2">Thank you for your support!</div>
          <div className="text-gray-700 text-center text-sm mb-4">God loves a cheerful giver.</div>
          <div className="text-gray-400 text-center text-xs italic">This is a computer-generated document. No signature is required.</div>
        </div>
      ))}
    </div >
  );
};

export default UploadExcel;
