"use client";
import supabase from "@/app/utils/supabase";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function TambahDataPembayaran() {
  // crud need
  const [message, setMessage] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [dataSpp, setDataSpp] = useState("");
  const [dataSiswa, setDataSiswa] = useState("");

  const getSppAndSiswa = () => {
    supabase
      .from("siswa")
      .select("nama_siswa,nis,kode_kelas(kode_kelas,tingkat)")
      .then((result) => {
        setDataSiswa(result.data);
      });

      supabase.from("bayar_spp")
      .select('kode_bayar_spp')
      .order("kode_bayar_spp", { ascending: false })
     
      .then((result) => {
        let max = result.data[0];
        console.log(max)
        let hasilpotongan = max.kode_bayar_spp.slice(9,16);
        hasilpotongan = parseInt(hasilpotongan) + 1;
        hasilpotongan = hasilpotongan.toString();
        hasilpotongan = hasilpotongan.slice(1,7)
        setKodeUrut(hasilpotongan)
      })

    supabase
      .from("spp")
      .select()
      .then((result) => {
        setDataSpp(result.data);
      });
  };

  useEffect(() => {
    getSppAndSiswa();
  }, []);

  const [kodeBayarSpp, setKodeBayarSpp] = useState("SPP");
  const [nis, setNis] = useState("");
  const [kodeSpp, setKodeSpp] = useState("");
  const [kodeUrut, setKodeUrut] = useState("");
  const [tahunAjar, setTahunAjar] = useState("");
  const [total_spp, setTotal_spp] = useState("");

  const simpanPembayaran = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (kodeBayarSpp === "") {
      setMessage("Please kode Bayar Spp");
      setIsLoading(false);
      return;
    }

    if (nis === "") {
      setMessage("Please add nis");
      setIsLoading(false);
      return;
    }

    let kode_bayar_spp
    kode_bayar_spp = kodeBayarSpp + kodeUrut;

    console.log(kode_bayar_spp.length);

    if(kode_bayar_spp.length !== 16) {
      setMessage("Kode spp tidak valid");
      setIsLoading(false);
      return;
    }

    try {
      const res = await supabase.from("bayar_spp").insert({
        kode_bayar_spp,
        nis,
        kode_spp : kodeSpp,
        total_spp
      });
      if(res.status == 201) { 
        setKodeBayarSpp("");
        setNis("");
        setKodeSpp("");
        setKodeUrut("");
        setTotal_spp("");
        setMessage("Pembayaran created success fully..!");
      } else {
        setMessage(res.error.message + ' (Kemungkinan kode bayar spp telah di pakai)');
        setIsLoading(false);
        return;
      }
     
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const cangeNisHandle = (e) => {
    setNis(e.target.value);

    const temSiswa = dataSiswa.filter((j) => {
      return j.nis == e.target.value;
    });
    console.log(temSiswa);
    if(temSiswa[0]?.kode_kelas?.tingkat == 'X') {
      setKodeBayarSpp(`SPPX00${tahunAjar}`);
    } else if(temSiswa[0]?.kode_kelas?.tingkat == 'XI') {
      setKodeBayarSpp(`SPPXI0${tahunAjar}`);
    } else {
      setKodeBayarSpp(`SPPXII${tahunAjar}`);
    }
  }


  const tahunAjarHandle = (e) => {
    setTahunAjar(e.target.value)

    const temSiswa = dataSiswa.filter((j) => {
      return j.nis == nis;
    });
    console.log(temSiswa);
    if(temSiswa[0]?.kode_kelas?.tingkat == 'X') {
      setKodeBayarSpp(`SPPX00${e.target.value}`);
    } else if(temSiswa[0]?.kode_kelas?.tingkat == 'XI') {
      setKodeBayarSpp(`SPPXI0${e.target.value}`);
    } else {
      setKodeBayarSpp(`SPPXII${e.target.value}`);
    }
  }

  const kodeSppHandel = (e) => {
    setKodeSpp(e.target.value)

    const tempNominal = dataSpp.filter((j) => {
      return j.kode_spp == e.target.value
    })

    console.log('tempNominal : ',tempNominal[0].nominal * 12);

    setTotal_spp(tempNominal[0].nominal * 12)
  
  }

  return (
    <div className="container">
      <p className="text-danger">
        {message}
        &nbsp;
      </p>

      {loading && (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      <div className="row">
        <div className="col-6">
          <div className="mb-3">
            <label htmlFor="kodeBayarSpp" className="form-label">
              Kode Bayar SPP
            </label>
            <input
              type="text"
              className="form-control"
              id="kodeBayarSpp"
              aria-describedby="emailHelp"
              placeholder="Kode Spp"
              value={kodeBayarSpp}
              readOnly
              onChange={(e) => setKodeBayarSpp(e.target.value)}
            />
          </div>
        </div>
        <div className="col-6">
          <div className="mb-3">
            <label htmlFor="kode_urut" className="form-label">
              Kode Urut
            </label>
            <input
              type="text"
              className="form-control"
              id="kode_urut"
              aria-describedby="emailHelp"
              placeholder="kode_urut"
              value={kodeUrut}
              readOnly
              onChange={(e) => setKodeUrut(e.target.value)}
            />
          </div>
        </div>
      </div>

      

      <div className="mb-3">
        <label htmlFor="exampleDataList" className="form-label">
          Nis
        </label>
        <input
          className="form-control"
          list="datalistOptions"
          id="exampleDataList"
          placeholder="Type to search..."
          value={nis}
          onChange={cangeNisHandle}
        />
        <datalist id="datalistOptions">
          {dataSiswa.length !== 0 &&
            dataSiswa.map((j, index) => (
              <option key={index} value={j.nis}>
                {`${j.nama_siswa} - ${j.kode_kelas.tingkat}`}
              </option>
            ))}
        </datalist>
      </div>

      <div className="mb-3">
        <label htmlFor="kode_urut" className="form-label">
          Angkatan
        </label>
        <input
          type="number"
          className="form-control"
          id="kode_urut"
          aria-describedby="emailHelp"
          placeholder="Contoh : '2223' (2022 - 2023)"
          value={tahunAjar}
          onChange={tahunAjarHandle}
        />
      </div>


      <div className="mb-3">
        <label htmlFor="spp" className="form-label">
          SPP
        </label>
        <select
          className="form-select"
          aria-label="Default select example"
          value={kodeSpp}
          onChange={kodeSppHandel}
        >
          <option value={""}>Pilih Spp</option>
          {dataSpp.length !== 0 &&
            dataSpp.map((j, index) => (
              <option key={index} value={j.kode_spp}>
                {j.kode_spp} -{j.tingkat} - {j.deskripsi}
              </option>
            ))}
        </select>
      </div>

      <button className="btn btn-primary " onClick={simpanPembayaran}>
        Simpan Pembayaran Spp
      </button>
      <Link className="btn btn-danger ms-2" href={"/dashboard/bayar_spp"}>
        kembali
      </Link>
    </div>
  );
}
