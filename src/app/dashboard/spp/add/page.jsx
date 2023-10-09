"use client";
import supabase from "@/app/utils/supabase";
import Link from "next/link";
import React, { useState } from "react";

export default function TambahDataSpp() {
  // crud need
    const [message,setMessage] = useState("");
    const [loading,setIsLoading] = useState(false);

    const [kodeSpp,setKodeSpp] = useState('');
    const [tingkat,setTingkat] = useState('');
    const [nominal,setNominal] = useState('');
    const [deskripsi,setDeskripsi] = useState('');

    const simpanSpp = async(e)=> {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");
    
        if(kodeSpp === ""){
          setMessage("Please add kode spp");
          setIsLoading(false)
          return;
        }
    
        if(tingkat === ""){
          setMessage("Please add deskirpsi tingkat");
          setIsLoading(false)
          return;
        }
        if(nominal === ""){
          setMessage("Please add deskirpsi nominal");
          setIsLoading(false)
          return;
        }
        if(deskripsi === ""){
          setMessage("Please add deskirpsi deskripsi");
          setIsLoading(false)
          return;
        }
    
        
    
        try {
          const res = await supabase.from("spp").insert({
            kode_spp : kodeSpp,
            tingkat,
            nominal,
            deskripsi
          });
          if(res.status == 201) {
            setKodeSpp("");
            setTingkat("");
            setNominal("");
            setDeskripsi("");
            setMessage("spp created success fully..!");
          } else {
            setMessage(res.error.message + ' (Kemungkinan kode spp telah di pakai)');
            setIsLoading(false);
            return
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
        <label htmlFor="kodeSpp" className="form-label">
          Kode Spp
        </label>
        <input
          type="text"
          className="form-control"
          id="kodeSpp"
          aria-describedby="emailHelp"
          placeholder="Kode Spp"
          value={kodeSpp}
          onChange={(e) => setKodeSpp(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="namajurusan" className="form-label">
          Tingkat Kelas
        </label>
        <select
          className="form-select"
          aria-label="Default select example"
          value={tingkat}
          onChange={(e) => setTingkat(e.target.value)}
        >
          <option value={""}>Pilih Tingkat Kelas</option>
          <option value={"X"}>X</option>
          <option value={"XI"}>XI</option>
          <option value={"XII"}>XII</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="Nominal" className="form-label">
          Nominal
        </label>
        <input
          type="text"
          className="form-control"
          id="Nominal"
          aria-describedby="emailHelp"
          placeholder="Nominal"
          value={nominal}
          onChange={(e) => setNominal(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="deskripsi" className="form-label">
          Deskripsi
        </label>
        <textarea
          type="text"
          className="form-control"
          id="deskripsi"
          aria-describedby="emailHelp"
          placeholder="deskripsi"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
        />
      </div>

      <button className="btn btn-primary " onClick={simpanSpp}>Simpan spp</button>
      <Link className="btn btn-danger ms-2" href={'/dashboard/spp'}>kembali</Link>
    </div>
  );
}
