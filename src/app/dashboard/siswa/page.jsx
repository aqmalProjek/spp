"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import supabase from "@/app/utils/supabase";
import Link from "next/link";
import DataTable from "react-data-table-component";

export default function SiswaPage() {
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [singleSiswa, setSingleSiswa] = useState([]);
  const [rowsRecord, setRowsRecord] = useState([]);

  const colums = [
    {
      name: "Nomor",
      selector: (row) => row.nomor,
      sortable: true,
    },
    {
      name: "Nis",
      selector: (row) => row.nis,
      sortable: true,
    },
    {
      name: "Nama Siswa",
      selector: (row) => row.nama_siswa,
      sortable: true,
    },
    {
      name: "Kelas",
      selector: (row) => row.kelas,
      sortable: true,
    },
    {
      name: "Aksi",
      selector: (row) => row.aksi,
      sortable: true,
      width: '300px',
      wrap: true
    },
  ];

  const showModalHandel = (j) => {
    setSingleSiswa(j);
  };
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
              aksi: (
                <>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => showModalHandel(k)}
                  >
                    Info
                  </button>
                  {" || "}
                  <button
                    className="btn btn-danger"
                    onClick={() => hapusSiswa(k.nis)}
                  >
                    Hapus
                  </button>{" "}
                  ||{" "}
                  <Link
                    href={`/dashboard/siswa/${k.nis}`}
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
              nis: k.nis,
              nama_siswa: k.nama_siswa,
              kelas: k.kode_kelas.kode_kelas,
              aksi: (
                <>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => showModalHandel(k)}
                  >
                    Info
                  </button>
                  {" || "}
                  <button
                    className="btn btn-danger"
                    onClick={() => hapusSiswa(k.nis)}
                  >
                    Hapus
                  </button>{" "}
                  ||{" "}
                  <Link
                    href={`/dashboard/siswa/${k.nis}`}
                    className="btn btn-success"
                  >
                    Edit
                  </Link>
                </>
              ),
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

  const hapusSiswa = async (id) => {
    if (confirm("Yakin menghapus siswa")) {
      const res = await supabase.from("siswa").delete().eq("nis", id);
      if(res.status !== 204) { 
        alert(res.error.message)
        return
      } 
    } else {
      console.log("tidak");
    }

    // await getSiswa()
  };

  console.log(siswa);

  const handleCariKode = (e) => {
    const newData = rowsRecord.filter((row) => {
      return row.nama_siswa
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });

    setSiswa(newData);
  }
  return (
    <div className="container">
      <Link href={"/dashboard/siswa/add"} className="btn btn-primary my-1">
        Tambah data
      </Link>
      <div className="mb-3 ms-auto" style={{ width: 500 }}>
        <input
          type="text"
          className="form-control"
          id="kodejurusantambahan"
          aria-describedby="emailHelp"
          placeholder="Cari Nama Siswa"
          onChange={handleCariKode}
        />
      </div>
      <DataTable
        columns={colums}
        data={siswa}
     
        pagination
        progressPending={loading}
        responsive
      ></DataTable>
      {/* agama

alamat
 

jenis_kelamin

kode_kelas
: 
{tingkat: 'XI', kode_kelas: 'XIBDP1', jurusan: {…}}
nama_siswa
 asep 
nama_wali
nis
no_siswa
no_wali
pekerjaan */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Modal title
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                {/*  */}
                <div className="col-5">Nama </div>
                <div className="col-2">:</div>
                <div className="col-5">{singleSiswa?.nama_siswa}</div>
                {/*  */}
                <div className="col-5">Kelas </div>
                <div className="col-2">:</div>
                <div className="col-5">
                  {singleSiswa?.kode_kelas?.kode_kelas}
                </div>
                {/*  */}
                <div className="col-5">Agama </div>
                <div className="col-2">:</div>
                <div className="col-5">{singleSiswa?.agama}</div>
                {/*  */}
                <div className="col-5">No Hp </div>
                <div className="col-2">:</div>
                <div className="col-5">{singleSiswa?.no_siswa}</div>
                {/*  */}
                <div className="col-5">Alamat </div>
                <div className="col-2">:</div>
                <div className="col-5">{singleSiswa?.alamat}</div>
                {/*  */}
                <div className="col-5">Jenis Kelamin </div>
                <div className="col-2">:</div>
                <div className="col-5">{singleSiswa?.jenis_kelamin}</div>
                {/*  */}
                <div className="col-5">Nama Wali </div>
                <div className="col-2">:</div>
                <div className="col-5">{singleSiswa?.nama_wali}</div>
                {/*  */}
                <div className="col-5">NO HP Wali </div>
                <div className="col-2">:</div>
                <div className="col-5">{singleSiswa?.no_wali}</div>
                {/*  */}
                <div className="col-5">Pekerjaan Wali </div>
                <div className="col-2">:</div>
                <div className="col-5">{singleSiswa?.pekerjaan}</div>
                {/*  */}
                <div className="col-5">Email Wali</div>
                <div className="col-2">:</div>
                <div className="col-5">{singleSiswa?.email_wali}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
