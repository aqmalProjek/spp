"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import supabase from "@/app/utils/supabase";
import Link from "next/link";
import { usePDF } from 'react-to-pdf';

export default function Page() {
  const { toPDF, targetRef } = usePDF({filename: 'jurusan.pdf'});
  const [jurusan, setJurusan] = useState([]);

  const getJurusan = () => {
    supabase
      .from("jurusan")
      .select("id,nama,deskripsi,singkatan,kode_jurusan")
      .order("created_at", { ascending: false })
      .then((result) => {
        setJurusan(result.data);
      });
  };

  useEffect(() => {
    getJurusan();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("realtime jurusan")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "jurusan",
        },
        (payload) => {
          getJurusan();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "jurusan",
        },
        (payload) => {
          getJurusan();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "jurusan",
        },
        (payload) => {
          getJurusan();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const hapusJurusan = async (id) => {
    if (confirm("Yakin menghapus jurusan")) {
      await supabase.from("jurusan").delete().eq("id", id);
    } else {
      console.log("tidak");
    }

    // await getJurusan()
  };

  console.log(jurusan);
  return (
    <div className="container">
      <Link href={"/dashboard/jurusan/add"} className="btn btn-primary my-1">
        Tambah data
      </Link>
      <button onClick={() => toPDF()} className="btn btn-info d-block">Download PDF</button>
      <table className="table" ref={targetRef}>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nama Jurusan</th>
            <th scope="col">Deskirpsi</th>
            <th scope="col">Singkatan</th>
            <th scope="col">Kode Jurusan</th>
            <th scope="col">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {jurusan.length !== 0 ? (
            jurusan.map((j, index) => (
              <tr key={index}>
                <td scope="row">{index + 1}</td>
                <td>{j.nama}</td>
                <td>{j.deskripsi}</td>
                <td>{j.singkatan}</td>
                <td>{j.kode_jurusan}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => hapusJurusan(j.id)}
                  >
                    Hapus
                  </button>{" "}
                  ||{" "}
                  <Link
                    href={`/dashboard/jurusan/${j.id}`}
                    className="btn btn-success"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>loading...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
