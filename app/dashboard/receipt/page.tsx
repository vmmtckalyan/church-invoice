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
interface MyObject {
  Amount: ""
  Date: "",
  Description: "",
  Heading: "",
  Mobile: "",
  Mode: "",
  Receipt: "",
  Name: "",
  number: "",
  // Add other properties as needed
}
const UploadExcel: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any[][] | null>(null);
  const contentRef = useRef(null);
  const [jsonData, setJsonData] = useState<MyObject[]>([])
  var data: any[] | React.SetStateAction<null> = []
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      data = XLSX.utils.sheet_to_json(ws);
      // const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      console.log("data", data);
      setJsonData(data);
      console.log("jsonData", jsonData)
    };

    reader.readAsBinaryString(file);
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const generatePDF = () => {
    const element = document.getElementById('divToPrint');
    html2pdf().from(element).save();
  };

  const handleUpload = () => {
    console.log("handleUpload", data)
    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        if (event.target) {
          const data = event.target.result;

          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const excelData = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });
          setExcelData(excelData);
        }
      };
      fileReader.readAsBinaryString(selectedFile);
    } else {
      console.log('No file selected.');
    }
  };


  return (
    <div>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
      />
      <button className="ml-5 mt-10 flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        onClick={handleUpload}>Upload</button>
      {jsonData && jsonData[0] && (
        <div>
          <h2>Excel Data:</h2>
          <table>
            <tbody ref={contentRef}>
              {jsonData.map((item, index) => (
                <tr key={index}>
                  {/* <td>{item.S.no}</td> */}
                  <td>{item.Amount}</td>
                  <td>{item.Date}</td>
                  <td>{item.Description}</td>
                  <td>{item.Heading}</td>
                  {/* <td>{item.Mobile no}</td> */}
                  <td>{item.Mode}</td>
                  <td>{item.Name}</td>
                  {/* <td>{item.Receipt No}</td> */}
                </tr>
              ))}
            </tbody>
          </table>

        </div >
      )}
      {jsonData.map((item, index) => (
        <div key={index} id="divToPrint" className="bg-gray-100 border-4  border-violet-500/75 rounded-3xl shadow-2xl px-6 py-8 max-w-md mx-auto mt-8">
          <Image
            src="/vmmtc-logo.png"
            alt="Vmmtc"
            width={75}
            height={75}
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
            <h2 className="text-lg font-bold mb-4">Received from: {item.Name}</h2>
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
                <td className="text-wrap pr-20 text-left text-gray-700 text-xs italic">({item.Description})</td>
              </tr>
              {/* <tr>
                <td className="text-left text-gray-700">Product 3</td>
                <td className="text-right text-gray-700">Rs.75.00</td>
              </tr> */}
            </tbody>
            <tfoot>
              {/* <tr>
                <td className="text-left font-bold text-gray-700">Total</td>
                <td className="text-right font-bold text-gray-700">Rs. {item.Amount}</td>
              </tr> */}
            </tfoot>
          </table>
          <div className="text-gray-700 text-center mb-2">Thank you for your support!</div>
          <div className="text-gray-700 text-center text-sm mb-4">God loves a cheerful giver.</div>
          <div className="text-gray-700 text-center text-xs italic">This is a computer-generated document. No signature is required.</div>
        </div>
      ))}
    </div >
  );
};

export default UploadExcel;
