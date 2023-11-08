"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import supabase from "@/app/utils/supabase";
import "react-data-table-component-extensions/dist/index.css";
import { usePDF } from "react-to-pdf";
import { rupiah } from "@/app/utils/helperFunction";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function TampilBayar_spp() {
  const {data : session, status} = useSession();
  const { toPDF, targetRef } = usePDF({filename: 'Laporan pembayaran.pdf'});
  const [bayar_spp, setBayar_spp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opsiLunas, setOpsiLunas] = useState("Semua");
  const [opsiLunasForm, setOpsiLunasForm] = useState("Semua");

  let tanggalSekarang = new Date();

  console.log('tgl sekarang ', tanggalSekarang);

  const colums = [
    {
      name: "Nomor",
      selector: "nomor",
      sortable: true,
    },
    {
      name: "Kode Bayar Spp",
      selector: "kode_bayar_spp",
      sortable: true,
    },
    {
      name: "Kode Spp",
      selector: "kode_spp",
      sortable: true,
    },
    {
      name: "Nis",
      selector: "nis",
      sortable: true,
    },
    {
      name: "Spp Perbulan",
      selector: "nominal",
      sortable: true,
    },
  ];

  const getBayar_spp = () => {
    setBayar_spp([]);
    setLoading(true);
    supabase
      .from("bayar_spp")
      .select(
        "kode_bayar_spp,kode_spp(nominal,kode_spp),nis(nis,nama_siswa,kode_kelas),juli,agustus,september,oktober, november,desember,januari,februari,maret,april,mei,juni,status,bulan_terakhir_bayar"
      )
      .order("created_at", { ascending: false })
      .then((result) => {
        result.data.map((k, index) => {
          setBayar_spp((bayar_spp) => [
            ...bayar_spp,
            {
              nomor: index + 1,
              nis: k.nis.nis,
              nama_siswa: k.nis.nama_siswa,
              kode_kelas: k.nis.kode_kelas,
              kode_bayar_spp: k.kode_bayar_spp,
              kode_spp: k.kode_spp.kode_spp,
              nominal: k.kode_spp.nominal,
              kode_kelas: k.nis.kode_kelas,
              status : k.status,
              bulan_terakhir_bayar : k.bulan_terakhir_bayar,
              juli : k.juli,
              agustus : k.agustus,
              september : k.september,
              oktober : k.oktober,
              november : k.november,
              desember : k.desember,
              januari : k.januari,
              februari : k.februari,
              maret : k.maret,
              april : k.april,
              mei : k.mei,
              juni : k.juni,
            },
          ]);
        });

        setLoading(false);
      });
  };

  useEffect(() => {
    getBayar_spp();
    document.title = "My Page Title";
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
    if (e.target.value.toLowerCase().includes("s")) {
      newData = rowsRecord.filter((row) => {
        return row.kode_bayar_spp
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
    } else {
      newData = rowsRecord.filter((row) => {
        return row.nis.toLowerCase().includes(e.target.value.toLowerCase());
      });
    }

    setBayar_spp(newData);
  };

  const tableData = {
    columns: colums,
    data: bayar_spp,
  };

  const filterLunas = (e) => {
    console.log(e.target.value);
    setOpsiLunasForm(e.target.value);
    if (e.target.value === "") {
      setOpsiLunas("Semua");
      supabase
        .from("bayar_spp")
        .select(
          "kode_bayar_spp,kode_spp(nominal,kode_spp),nis(nis,nama_siswa,kode_kelas),juli,agustus,september,oktober, november,desember,januari,februari,maret,april,mei,juni,status,bulan_terakhir_bayar"
        )
        .order("created_at", { ascending: false })
        .then((result) => {
          result.data.map((k, index) => {
            setBayar_spp((bayar_spp) => [
              ...bayar_spp,
              {
                nomor: index + 1,
              nis: k.nis.nis,
              nama_siswa: k.nis.nama_siswa,
              kode_kelas: k.nis.kode_kelas,
              kode_bayar_spp: k.kode_bayar_spp,
              kode_spp: k.kode_spp.kode_spp,
              nominal: k.kode_spp.nominal,
              kode_kelas: k.nis.kode_kelas,
              status : k.status,
              bulan_terakhir_bayar : k.bulan_terakhir_bayar,
              juli : k.juli,
              agustus : k.agustus,
              september : k.september,
              oktober : k.oktober,
              november : k.november,
              desember : k.desember,
              januari : k.januari,
              februari : k.februari,
              maret : k.maret,
              april : k.april,
              mei : k.mei,
              juni : k.juni,
              },
            ]);
          });

          setLoading(false);
        });
      return;
    }
    setBayar_spp([]);

    if (e.target.value === "uts1") {
      setOpsiLunas("LUNAS UTS SMESTER 1");
      supabase
        .from("bayar_spp")
        .select(
          "kode_bayar_spp,kode_spp(nominal,kode_spp),nis(nis,nama_siswa,kode_kelas),juli,agustus,september,oktober, november,desember,januari,februari,maret,april,mei,juni,status,bulan_terakhir_bayar"
        )
        .order("created_at", { ascending: false })
        .not("september", "is", null)
        .then((result) => {
          result.data.map((k, index) => {
            setBayar_spp((bayar_spp) => [
              ...bayar_spp,
              {
                nomor: index + 1,
              nis: k.nis.nis,
              nama_siswa: k.nis.nama_siswa,
              kode_kelas: k.nis.kode_kelas,
              kode_bayar_spp: k.kode_bayar_spp,
              kode_spp: k.kode_spp.kode_spp,
              nominal: k.kode_spp.nominal,
              kode_kelas: k.nis.kode_kelas,
              status : k.status,
              bulan_terakhir_bayar : k.bulan_terakhir_bayar,
              juli : k.juli,
              agustus : k.agustus,
              september : k.september,
              oktober : k.oktober,
              november : k.november,
              desember : k.desember,
              januari : k.januari,
              februari : k.februari,
              maret : k.maret,
              april : k.april,
              mei : k.mei,
              juni : k.juni,
              },
            ]);
          });

          setLoading(false);
        });
    } else if (e.target.value === "uas1") {
      setOpsiLunas("LUNAS UAS SMESTER 1");
      supabase
        .from("bayar_spp")
        .select(
          "kode_bayar_spp,kode_spp(nominal,kode_spp),nis(nis,nama_siswa,kode_kelas),juli,agustus,september,oktober, november,desember,januari,februari,maret,april,mei,juni,status,bulan_terakhir_bayar"
        )
        .order("created_at", { ascending: false })
        .not("desember", "is", null)
        .then((result) => {
          result.data.map((k, index) => {
            setBayar_spp((bayar_spp) => [
              ...bayar_spp,
              {
                nomor: index + 1,
              nis: k.nis.nis,
              nama_siswa: k.nis.nama_siswa,
              kode_kelas: k.nis.kode_kelas,
              kode_bayar_spp: k.kode_bayar_spp,
              kode_spp: k.kode_spp.kode_spp,
              nominal: k.kode_spp.nominal,
              kode_kelas: k.nis.kode_kelas,
              status : k.status,
              bulan_terakhir_bayar : k.bulan_terakhir_bayar,
              juli : k.juli,
              agustus : k.agustus,
              september : k.september,
              oktober : k.oktober,
              november : k.november,
              desember : k.desember,
              januari : k.januari,
              februari : k.februari,
              maret : k.maret,
              april : k.april,
              mei : k.mei,
              juni : k.juni,
              },
            ]);
          });

          setLoading(false);
        });
    } else if (e.target.value === "uts2") {
      setOpsiLunas("LUNAS UTS SMESTER 2");
      supabase
        .from("bayar_spp")
        .select(
          "kode_bayar_spp,kode_spp(nominal,kode_spp),nis(nis,nama_siswa,kode_kelas),juli,agustus,september,oktober, november,desember,januari,februari,maret,april,mei,juni,status,bulan_terakhir_bayar"
        )
        .order("created_at", { ascending: false })
        .not("maret", "is", null)
        .then((result) => {
          result.data.map((k, index) => {
            setBayar_spp((bayar_spp) => [
              ...bayar_spp,
              {
                nomor: index + 1,
              nis: k.nis.nis,
              nama_siswa: k.nis.nama_siswa,
              kode_kelas: k.nis.kode_kelas,
              kode_bayar_spp: k.kode_bayar_spp,
              kode_spp: k.kode_spp.kode_spp,
              nominal: k.kode_spp.nominal,
              kode_kelas: k.nis.kode_kelas,
              status : k.status,
              bulan_terakhir_bayar : k.bulan_terakhir_bayar,
              juli : k.juli,
              agustus : k.agustus,
              september : k.september,
              oktober : k.oktober,
              november : k.november,
              desember : k.desember,
              januari : k.januari,
              februari : k.februari,
              maret : k.maret,
              april : k.april,
              mei : k.mei,
              juni : k.juni,
              },
            ]);
          });

          setLoading(false);
        });
    } else if (e.target.value === "uas2") {
      setOpsiLunas("LUNAS UAS SMESTER 2");
      supabase
        .from("bayar_spp")
        .select(
          "kode_bayar_spp,kode_spp(nominal,kode_spp),nis(nis,nama_siswa,kode_kelas),juli,agustus,september,oktober, november,desember,januari,februari,maret,april,mei,juni,status,bulan_terakhir_bayar"
        )
        .order("created_at", { ascending: false })
        .not("juni", "is", null)
        .then((result) => {
          result.data.map((k, index) => {
            setBayar_spp((bayar_spp) => [
              ...bayar_spp,
              {
                nomor: index + 1,
              nis: k.nis.nis,
              nama_siswa: k.nis.nama_siswa,
              kode_kelas: k.nis.kode_kelas,
              kode_bayar_spp: k.kode_bayar_spp,
              kode_spp: k.kode_spp.kode_spp,
              nominal: k.kode_spp.nominal,
              kode_kelas: k.nis.kode_kelas,
              status : k.status,
              bulan_terakhir_bayar : k.bulan_terakhir_bayar,
              juli : k.juli,
              agustus : k.agustus,
              september : k.september,
              oktober : k.oktober,
              november : k.november,
              desember : k.desember,
              januari : k.januari,
              februari : k.februari,
              maret : k.maret,
              april : k.april,
              mei : k.mei,
              juni : k.juni,
              },
            ]);
          });

          setLoading(false);
        });
    }
  };

  return (
    <div className="container">
      <button
        type="button"
        className="btn btn-primary mt-3"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Filter data pembayaran
      </button>
      {/* Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Filter Data
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="namajurusan" className="form-label">
                  Filter berdasarkan Lunas
                </label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  value={opsiLunasForm}
                  onChange={filterLunas}
                >
                  <option value={""}>Pilih opsi lunas</option>

                  <option value={"uts1"}>LUNAS UTS SMESTER 1</option>
                  <option value={"uas1"}>LUNAS UAS SMESTER 1</option>
                  <option value={"uts2"}>LUNAS UTS SMESTER 2</option>
                  <option value={"uas2"}>LUNAS UAS SMESTER 2</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
      <button onClick={() => toPDF()} className="btn btn-info d-block my-2">Download PDF</button>
      
      <p className="text-warning">Filter menunjukan : {opsiLunas}</p>
      <div ref={targetRef}>
      <div className="col-md-12">
            <div className="row border-bottom pb-2">
              <div className="col-3 position-relative">
                <Image
                  src="/logoyayasan.png"
                  alt=".."
                  width={200}
                  height={200}
                  objectFit="center"
                />
              </div>
              <div className="col-9">
                <div className="row">
                  <div className="col-12">
                    <p align="center">
                      Yayasan Pendidikan Dasar Dan Menengah BAKTINUSANTARA 666
                    </p>
                  </div>
                  <div className="col-12">
                    <h3 align="center">SMK BAKTI NUSANTARA 666</h3>
                  </div>
                  <div className="col-12">
                    <p align="center">Terakreditasi A</p>
                  </div>
                  <div className="col-12">
                    <p align="center">
                      Jl. Percobaan No. 65 Cileunyi Kab. Bandung (022)70721934
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      <p>Tanggal Laporan : {tanggalSekarang.getDate()} - {tanggalSekarang.getMonth()} - {tanggalSekarang.getFullYear()}</p>
      <table className="table table-hover" >
        <thead>
          <tr>
            <th scope="col">Nomor</th>
            <th scope="col">kode_bayar_spp</th>
            <th scope="col">Nama Siswa</th>
            <th scope="col">Kelas Siswa</th>
            <th scope="col">Biaya Bulanan</th>
            <th scope="col">status</th>
            <th scope="col">Bulan Terakhir Bayar</th>
            <th scope="col">Dana Terkumpul</th>
          </tr>
        </thead>
        <tbody>
          {bayar_spp.length !== 0 &&(
              bayar_spp.map((k, index) => (
                <tr key={index}>
                  <td >{index + 1}</td>
            <td >{k.kode_bayar_spp}</td>
            <td >{k.nama_siswa}</td>
            <td >{k.kode_kelas}</td>
            <td >{rupiah(k.nominal)}</td>
            <td >{k.status}</td>
            <td>{k.bulan_terakhir_bayar}</td>
            <td>{rupiah(
              k.juli +
              k.agustus +
              k.september +
              k.oktober +
              k.november +
              k.desember +
              k.januari +
              k.februari +
              k.maret +
              k.april +
              k.mei +
              k.juni
            )}</td>
                </tr>
              ))
            )}
        </tbody>
      </table>


      <p>Hormat Kami,</p>
      <br />
      <br />
      <br />
      <p>{session?.user?.name}</p>
      </div>
    </div>
  );
}
