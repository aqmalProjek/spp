"use client"
import supabase from "@/app/utils/supabase";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { usePDF } from "react-to-pdf";

export default function TampilPembayaran() {
    const router = useRouter();

    const [tahunAwal, setTahunAwal] = useState('');
    const [tahunAkhir, setTahunAkhir] = useState('');
    const [namasekolah, setNamasekolah] = useState('');
    const [tahungLengkap,setTahunLengkap] = useState('');


    const getSetting = () => {
      supabase
        .from("setting")
        .select("*")
        .eq('id',1)
        .single()
        .then((result) => {
          let tahun_awal,tahun_akhir;

          tahun_awal = result.data.tahun_ajaran_sekarang;
          tahun_awal = tahun_awal.split("-");
          tahun_awal = tahun_awal[0];

          tahun_akhir = result.data.tahun_ajaran_sekarang;
          tahun_akhir = tahun_akhir.split("-");
          tahun_akhir = tahun_akhir[1];

          setTahunAwal(tahun_awal)
          setTahunAkhir(tahun_akhir)
          setNamasekolah(result.data.nama_sekolah);
let tahun_lengkap = tahun_awal + tahun_akhir
          setTahunLengkap(tahun_lengkap);


          console.log('tahun lengkap : ',tahun_lengkap);
          console.log('setting sebelum di setting : ',result.data);
        });
    };


    const [kodeBayar_spp,setKodeBayar_spp] = useState("");
    const [dataSpp,setDataSpp] = useState([]);

    //SPPX002324000002

    const getData = () => {
      supabase.from("bayar_spp")
      .select(
        "kode_bayar_spp,tahun_ajaran,kode_spp(nominal,kode_spp),nis(nis,nama_siswa,kode_kelas),juli,agustus,september,oktober, november,desember,januari,februari,maret,april,mei,juni"
      )
      .order("created_at", { ascending: false })
      .then((result) => {
        setDataSpp(result.data)
        console.log('data spp : ',result.data);
      })
    }

    useEffect(() => {
      getData()
      getSetting()
    
      
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
              <option key={index} value={j.kode_bayar_spp} className="bg-light">
               {j.tahun_ajaran === tahungLengkap ? (
                
                `${j.nis.nis} - ${j.nis.kode_kelas} - ${j.nis.nama_siswa} `
               ) : (
                `${j.nis.nis} - ${j.nis.kode_kelas} - ${j.nis.nama_siswa} - belum lunas ${j.tahun_ajaran}`
               )}

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
