"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import supabase from "@/app/utils/supabase";
import Link from "next/link";
import DataTable from "react-data-table-component";
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

export default function SiswaPage() {
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [singleSiswa, setSingleSiswa] = useState([]);
  const [rowsRecord, setRowsRecord] = useState([]);

  const colums = [
    {
      name: "Nomor",
      selector: 'nomor',
      sortable: true,
    },
    {
      name: "Nis",
      selector: 'nis',
      sortable: true,
    },
    {
      name: "Nama Siswa",
      selector: 'nama_siswa',
      sortable: true,
    },
    {
      name: "Kelas",
      selector: 'kelas',
      sortable: true,
    },
    
  ];

  
  console.log(singleSiswa);
  const getSiswa = () => {
    setSiswa([]);
    setRowsRecord([]);
    setLoading(true)
    supabase
      .from("siswa")
      .select(
        "nis,created_at,nama_siswa,kode_kelas(tingkat,jurusan(nama),kode_kelas),nama_wali,no_wali,pekerjaan,no_siswa,alamat,jenis_kelamin,agama,email_wali"
      )
      .order("created_at", { ascending: false })
      .then((result) => {
        result.data.map((k, index) => {
          setSiswa((siswa) => [
            ...siswa,
            {
              nomor: index + 1,
              nis: k.nis,
              nama_siswa: k.nama_siswa,
              kelas: k.kode_kelas.kode_kelas,
              
            },
          ]);
        });

        result.data.map((k, index) => {
          setRowsRecord((rowsRecord) => [
            ...rowsRecord,
            {
              nomor: index + 1,
              nis: k.nis,
              nama_siswa: k.nama_siswa,
              kelas: k.kode_kelas.kode_kelas,
              
            },
          ]);
        });

setLoading(false)

      });
  };

  useEffect(() => {
    getSiswa();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("realtime siswa")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "siswa",
        },
        (payload) => {
          getSiswa();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "siswa",
        },
        (payload) => {
          getSiswa();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "siswa",
        },
        (payload) => {
          getSiswa();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

 

  const tableData = {
    columns : colums,
    data : siswa,
  };

  return (
    <div className="container">
     <DataTableExtensions
      {...tableData}
    >


      <DataTable
        noHeader
        defaultSortField="nomor"
        defaultSortAsc={false}
        pagination
        highlightOnHover
      ></DataTable>
    </DataTableExtensions>
    
    </div>
  );
}
