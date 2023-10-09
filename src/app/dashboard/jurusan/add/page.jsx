"use client";
import supabase from "@/app/utils/supabase";
import Link from "next/link";
import React, { useState } from "react";

export default function TambahDataJurusan() {
  // crud need
    const [message,setMessage] = useState("");
    const [loading,setIsLoading] = useState(false);

    const [namaJurusan,setNamaJurusan] = useState('');
    const [deskirpsiJurusan,setDeskripsiJurusan] = useState('');
    const [singkatanJurusan,setSingkatanJurusan] = useState('');
    const [kodeJurusan,setkodeJurusan] = useState('');

    const simpanJurusan = async(e)=> {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");
    
        if(namaJurusan === ""){
          setMessage("Please add nama Jurusan");
          setIsLoading(false)
          return;
        }
    
        if(deskirpsiJurusan === ""){
          setMessage("Please add deskirpsi Jurusan");
          setIsLoading(false)
          return;
        }
    
        
    
        try {
          const res = await supabase.from("jurusan").insert({
            nama : namaJurusan,
            deskripsi : deskirpsiJurusan,
            singkatan: singkatanJurusan,
            kode_jurusan: kodeJurusan
          });
          if(res.status == 201) { 
            setNamaJurusan("");
          setDeskripsiJurusan("");
          setSingkatanJurusan("");
          setkodeJurusan("");
          setMessage("Jurusan created success fully..!");
          } else {
            setMessage(res.error.message + ' (Kemungkinan kode jurusan telah di pakai)');
            setIsLoading(false);
            true;
          }
          
        } catch (error) {
          console.log(error);
        }
        setIsLoading(false);
    }

    
  return (
    <div className="container">
        <p className="text-danger">{message}
        &nbsp;
        </p>

        {loading && (

<div className="spinner-border" role="status">
<span className="visually-hidden">Loading...</span>
</div>
)}
      <div className="mb-3">
        <label htmlFor="namajurusan" className="form-label">
          Nama Jurusan
        </label>
        <input
          type="text"
          className="form-control"
          id="namajurusan"
          aria-describedby="emailHelp"
          placeholder="Nama Jurusan"
          value={namaJurusan}
          onChange={(e) => setNamaJurusan(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="deskirpsi Jurusan" className="form-label">
          Deskirpsi Jurusan
        </label>
        <input
          type="text"
          className="form-control"
          id="deskirpsi Jurusan"
          aria-describedby="emailHelp"
          placeholder="Deskirpsi Jurusan"
          value={deskirpsiJurusan}
          onChange={(e) => setDeskripsiJurusan(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="singkatan Jurusan" className="form-label">
          Singkatan Jurusan
        </label>
        <input
          type="text"
          className="form-control"
          id="Singkatan Jurusan"
          aria-describedby="emailHelp"
          placeholder="Singkatan Jurusan"
          value={singkatanJurusan}
          onChange={(e) => setSingkatanJurusan(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="singkatan Jurusan" className="form-label">
          Kode Jurusan
        </label>
        <input
          type="text"
          className="form-control"
          id="Singkatan Jurusan"
          aria-describedby="emailHelp"
          placeholder="Singkatan Jurusan"
          value={kodeJurusan}
          onChange={(e) => setkodeJurusan(e.target.value)}
        />
      </div>

      <button className="btn btn-primary " onClick={simpanJurusan}>Simpan jurusan</button>
      <Link className="btn btn-danger ms-2" href={'/dashboard/jurusan'}>kembali</Link>
    </div>
  );
}
