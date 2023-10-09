"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import supabase from "@/app/utils/supabase";
import Link from "next/link";
import DataTable from "react-data-table-component";

export default function Kelas() {
  const [kelas, setKelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowsRecord, setRowsRecord] = useState([]);
  const colums = [
    {
      name: "Nomor",
      selector: (row) => row.nomor,
      sortable: true,
    },
    {
      name: "Kode Kelas",
      selector: (row) => row.kode_kelas,
      sortable: true,
    },
    {
      name: "Tingkat",
      selector: (row) => row.tingkat,
      sortable: true,
    },
    {
      name: "Jurusan",
      selector: (row) => row.jurusan,
      sortable: true,
    },
    {
      name: "Aksi",
      selector: (row) => row.aksi,
      sortable: true,
    },
  ];
  let data = [];

  const getKelas = () => {
    setKelas([]);
    setRowsRecord([]);

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
              aksi: (
                <>
                  <button
                    className="btn btn-danger"
                    onClick={() => hapuskelas(k.kode_kelas)}
                  >
                    Hapus
                  </button>{" "}
                  ||{" "}
                  <Link
                    href={`/dashboard/kelas/${k.kode_kelas}`}
                    className="btn btn-success"
                  >
                    Edit
                  </Link>
                </>
              ),
            },
          ]);
        });

        result.data.map((k, index) => {
          setRowsRecord((rowsRecord) => [
            ...rowsRecord,
            {
              nomor: index + 1,
              kode_kelas: k.kode_kelas,
              tingkat: k.tingkat,
              jurusan: k.jurusan_id.nama,
              aksi: (
                <>
                  <button
                    className="btn btn-danger"
                    onClick={() => hapuskelas(k.kode_kelas)}
                  >
                    Hapus
                  </button>{" "}
                  ||{" "}
                  <Link
                    href={`/dashboard/kelas/${k.kode_kelas}`}
                    className="btn btn-success"
                  >
                    Edit
                  </Link>
                </>
              ),
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

  const hapuskelas = async (id) => {
    if (confirm("Yakin menghapus kelas")) {
      await supabase.from("kelas").delete().eq("kode_kelas", id);
    } else {
      console.log("tidak");
    }

    // await getJurusan()
  };

  const handleCariKode = (e) => {
    const newData = rowsRecord.filter((row) => {
      return row.kode_kelas
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });

    setKelas(newData);
  };

  return (
    <div className="container">
      <Link href={"/dashboard/kelas/add"} className="btn btn-primary my-1">
        Tambah data
      </Link>

      <div className="mb-3 ms-auto" style={{ width: 500 }}>
        <input
          type="text"
          className="form-control"
          id="kodejurusantambahan"
          aria-describedby="emailHelp"
          placeholder="Cari kode Kelas"
          onChange={handleCariKode}
        />
      </div>
      <DataTable
        columns={colums}
        data={kelas}
        pagination
        progressPending={loading}
        responsive
      ></DataTable>
    </div>
  );
}
