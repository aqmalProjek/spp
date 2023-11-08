"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import supabase from "@/app/utils/supabase";
import Link from "next/link";
import DataTable from "react-data-table-component";

export default function TampilBayar_spp() {
  const [bayar_spp, setBayar_spp] = useState([]);
  const [rowsRecord, setRowsRecord] = useState([]);
  const [loading, setLoading] = useState(true);

  

  const colums = [
    {
      name: "Nomor",
      selector: (row) => row.nomor,
      sortable: true,
    },
    {
      name: "Kode Bayar Spp",
      selector: (row) => row.kode_bayar_spp,
      sortable: true,
    },
    {
      name: "Kode Spp",
      selector: (row) => row.kode_spp,
      sortable: true,
    },
    {
      name: "Nis",
      selector: (row) => row.nis,
      sortable: true,
    },
    {
      name: "Spp Perbulan",
      selector: (row) => row.nominal,
      sortable: true,
    },
    {
      name: "Aksi",
      selector: (row) => row.aksi,
      width: "300px",
      wrap: true,
    },
  ];

  const getBayar_spp = () => {
    setBayar_spp([]);
    setRowsRecord([]);
    setLoading(true);
    supabase
      .from("bayar_spp")
      .select(
        "kode_bayar_spp,kode_spp(nominal,kode_spp),nis(nis),juli,agustus,september,oktober, november,desember,januari,februari,maret,april,mei,juni"
      )
      .order("created_at", { ascending: false })
      .then((result) => {
        result.data.map((k, index) => {
          setBayar_spp((bayar_spp) => [
            ...bayar_spp,
            {
              nomor: index + 1,
              kode_bayar_spp: k.kode_bayar_spp,
              kode_spp: k.kode_spp.kode_spp,
              nis: k.nis.nis,
              nominal: k.kode_spp.nominal,
              aksi: (
                <>
                  <button
                    className="btn btn-danger"
                    onClick={() => hapusbayar_spp(k.kode_bayar_spp)}
                  >
                    Hapus
                  </button>{" "}
                  ||{" "}
                  <Link
                    href={`/dashboard/bayar_spp/${k.kode_bayar_spp}`}
                    className="btn btn-success"
                  >
                    Edit
                  </Link>
                  ||{" "}
                  <Link
                    href={`/dashboard/pembayaran/${k.kode_bayar_spp}`}
                    className="btn btn-info"
                  >
                    Bayar Spp
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
              kode_bayar_spp: k.kode_bayar_spp,
              kode_spp: k.kode_spp.kode_spp,
              nis: k.nis.nis,
              nominal: k.kode_spp.nominal,
              aksi: (
                <>
                  <button
                    className="btn btn-danger"
                    onClick={() => hapusbayar_spp(k.kode_bayar_spp)}
                  >
                    Hapus
                  </button>{" "}
                  ||{" "}
                  <Link
                    href={`/dashboard/bayar_spp/${k.kode_bayar_spp}`}
                    className="btn btn-success"
                  >
                    Edit
                  </Link>
                  ||{" "}
                  <Link
                    href={`/dashboard/pembayaran/${k.kode_bayar_spp}`}
                    className="btn btn-info"
                  >
                    Bayar Spp
                  </Link>
                </>
              ),
            },
          ]);
        });

        setLoading(false);
      });
  };

  useEffect(() => {
    getBayar_spp();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("realtime bayar_spp")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bayar_spp",
        },
        (payload) => {
          getBayar_spp();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bayar_spp",
        },
        (payload) => {
          getBayar_spp();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bayar_spp",
        },
        (payload) => {
          getBayar_spp();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const hapusbayar_spp = async (id) => {
    if (confirm("Yakin menghapus bayar_spp")) {
      await supabase.from("bayar_spp").delete().eq("kode_bayar_spp", id);
    } else {
      console.log("tidak");
    }

    // await getBayar_spp()
  };

  console.log(bayar_spp);

  const handleCariKode = (e) => {
    let newData;
    if (e.target.value.toLowerCase().includes('s')) {

      newData = rowsRecord.filter((row) => {
       return row.kode_bayar_spp
         .toLowerCase()
         .includes(e.target.value.toLowerCase());
     });
    } else {
      newData = rowsRecord.filter((row) => {
        return row.nis
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
    }

    setBayar_spp(newData);
  }
  return (
    <div className="container">
      <Link href={"/dashboard/bayar_spp/add"} className="btn btn-primary my-1">
        Tambah data
      </Link>

      <div className="mb-3 ms-auto" style={{ width: 500 }}>
        <input
          type="text"
          className="form-control"
          id="kodejurusantambahan"
          aria-describedby="emailHelp"
          placeholder="Cari Kode Bayar Spp Atau Nis"
          onChange={handleCariKode}
        />
      </div>
      <DataTable
        columns={colums}
        data={bayar_spp}
        pagination
        progressPending={loading}
        responsive
      ></DataTable>
      {/* <table className="table">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Kode Bayar Spp</th>
            <th scope="col">Kode Spp</th>
            <th scope="col">Nis</th>
            <th scope="col">Spp Perbulan</th>
            <th scope="col">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {bayar_spp.length !== 0 ? (
            bayar_spp.map((j, index) => (
              <tr key={index}>
                <td scope="row">{index + 1}</td>
                <td>{j.kode_bayar_spp}</td>
                <td>{j.kode_spp.kode_spp}</td>
                <td>{j.nis.nis}</td>
                <td>{j.kode_spp.nominal}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => hapusbayar_spp(j.kode_bayar_spp)}
                  >
                    Hapus
                  </button>{" "}
                  ||{" "}
                  <Link
                    href={`/dashboard/bayar_spp/${j.kode_bayar_spp}`}
                    className="btn btn-success"
                  >
                    Edit
                  </Link>
                  ||{" "}
                  <Link
                    href={`/dashboard/pembayaran/${j.kode_bayar_spp}`}
                    className="btn btn-info"
                  >
                    Bayar Spp
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
      </table> */}
    </div>
  );
}
