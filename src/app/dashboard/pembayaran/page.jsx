"use client"
import supabase from "@/app/utils/supabase";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { usePDF } from "react-to-pdf";

export default function TampilPembayaran() {
    const router = useRouter();

    const [kodeBayar_spp,setKodeBayar_spp] = useState("");
    const [dataSpp,setDataSpp] = useState([]);

    const getData = () => {
      supabase.from("bayar_spp")
      .select(
        "kode_bayar_spp,kode_spp(nominal,kode_spp),nis(nis,nama_siswa,kode_kelas),juli,agustus,september,oktober, november,desember,januari,februari,maret,april,mei,juni"
      )
      .order("created_at", { ascending: false })
      .then((result) => {
        setDataSpp(result.data)
      })
    }

    useEffect(() => {
      getData()
    
      
    }, [])
    

    const submitHandel = (e) => {
        e.preventDefault();
        console.log(kodeBayar_spp);
        router.push(`/dashboard/pembayaran/${kodeBayar_spp}`);
    }

  return (
    <div className="container">
        <form onSubmit={submitHandel}>
            
      <div className="input-group mb-3 my-2">
        <button className="input-group-text" id="basic-addon1">
          Cari
        </button>
        <input
          className="form-control"
          list="datalistOptions"
          id="exampleDataList"
          placeholder="Type to search..."
          aria-label="Username"
          aria-describedby="basic-addon1"
          value={kodeBayar_spp}
          onChange={e => setKodeBayar_spp(e.target.value)}
        />
         <datalist id="datalistOptions">
          {dataSpp.length !== 0 &&
            dataSpp.map((j, index) => (
              <option key={index} value={j.kode_bayar_spp}>
                {`${j.nis.nis} - ${j.nis.kode_kelas} - ${j.nis.nama_siswa}`}
              </option>
            ))}
        </datalist>

        {/* className="form-control"
          placeholder="Kode Bayar Spp"
          aria-label="Username"
          aria-describedby="basic-addon1" */}

        {/* <input
          className="form-control"
          list="datalistOptions"
          id="exampleDataList"
          placeholder="Type to search..."
          value={nis}
          onChange={cangeNisHandle}
        />
        */}
      </div>
        </form>
    </div>
  );
}
