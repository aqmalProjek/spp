"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import supabase from "@/app/utils/supabase";
import { usePDF } from "react-to-pdf";

export default function Kelas() {
  const { toPDF, targetRef } = usePDF({filename: 'Laporan Kelas.pdf'});
  const [kelas, setKelas] = useState([]);
  const colums = [
    {
      name: "Nomor",
      selector: 'nomor',
      sortable: true,
    },
    {
      name: "Kode Kelas",
      selector: 'kode_kelas',
      sortable: true,
    },
    {
      name: "Tingkat",
      selector: 'tingkat',
      sortable: true,
    },
    {
      name: "Jurusan",
      selector: 'jurusan',
      sortable: true,
    },
  ];

  const getKelas = () => {
    setKelas([]);

    supabase
      .from("kelas")
      .select("kode_kelas,tingkat,jurusan_id(nama)")
      .order("created_at", { ascending: false })
      .then((result) => {
        result.data.map((k, index) => {
          setKelas((kelas) => [
            ...kelas,
            {
              nomor: index + 1,
              kode_kelas: k.kode_kelas,
              tingkat: k.tingkat,
              jurusan: k.jurusan_id.nama,
            },
          ]);
        });

       
      });

  };

  useEffect(() => {
    getKelas();
    document.title = 'My Page Title';
  }, []);

  console.log(kelas);

  useEffect(() => {
    const channel = supabase
      .channel("realtime kelas")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "kelas",
        },
        (payload) => {
          getKelas();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "kelas",
        },
        (payload) => {
          getKelas();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "kelas",
        },
        (payload) => {
          getKelas();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const tableData = {
    columns : colums,
    data : kelas,
  };

 

  return (
    <div className="container">
      <button onClick={() => toPDF()} className="btn btn-info d-block my-2">Download PDF</button>
      <table className="table table-hover" ref={targetRef}>
        <thead>
          <tr>
          


            <th scope="col">Nomor</th>
            <th scope="col">kode_kelas</th>
            <th scope="col">tingkat</th>
            <th scope="col">jurusan</th>
          </tr>
        </thead>
        <tbody>
          {kelas.length !== 0 &&(
              kelas.map((k, index) => (
                <tr key={index}>
                  <td >{index + 1}</td>
            <td >{k.kode_kelas}</td>
            <td >{k.tingkat}</td>
            <td >{k.jurusan}</td>
                </tr>
              ))
            )}
        </tbody>
      </table>
    </div>
  );
}
