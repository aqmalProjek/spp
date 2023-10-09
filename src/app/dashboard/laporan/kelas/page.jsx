"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import supabase from "@/app/utils/supabase";
import Link from "next/link";
import DataTable from "react-data-table-component";
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

export default function Kelas() {
  const [kelas, setKelas] = useState([]);
  const [loading, setLoading] = useState(true);
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
  let data = [];

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

    setLoading(false);
  };

  useEffect(() => {
    getKelas();
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
