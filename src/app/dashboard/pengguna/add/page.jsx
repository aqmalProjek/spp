"use client";
import supabase from "@/app/utils/supabase";
import Link from "next/link";
import React, { useState } from "react";

export default function TambahDataPengguna() {
  // crud need
    const [message,setMessage] = useState("");
    const [loading,setIsLoading] = useState(false);

    const [userName,setUserName] = useState('');
    const [password,setPassword] = useState('');
    const [role,setRole] = useState('');

    const simpanPengguna = async(e)=> {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");
    
        if(userName === ""){
          setMessage("Please add username");
          setIsLoading(false)
          return;
        }
    
        if(password === ""){
          setMessage("Please add password");
          setIsLoading(false)
          return;
        }
        if(role === ""){
          setMessage("Please add role");
          setIsLoading(false)
          return;
        }
    
        
    
        try {
          const res = await supabase.from("pengguna").insert({
            username : userName,
            password,
            role,
          });
          if(res.status == 201) { 
            setUserName("");
          setPassword("");
          setRole("");
          setMessage("pengguna created success fully..!");
          } else {
            setMessage(res.error.message + ' (Kemungkinan kode pengguna telah di pakai)');
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
        <label htmlFor="userName" className="form-label">
          Username Pengguna
        </label>
        <input
          type="text"
          className="form-control"
          id="userName"
          aria-describedby="emailHelp"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="deskirpsi Jurusan" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="deskirpsi Jurusan"
          aria-describedby="emailHelp"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="singkatan Jurusan" className="form-label">
          Role
        </label>
        <select
              className="form-select"
              aria-label="Default select example"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value={""}>Pilih Role</option>

              <option value={"ADMIN"}>ADMIN</option>
              <option value={"PEGAWAI"}>PEGAWAI</option>
              <option value={"KEPALA SEKOLAH"}>KEPALA SEKOLAH</option>
            </select>
      </div>

     

      <button className="btn btn-primary " onClick={simpanPengguna}>Simpan Pengguna</button>
      <Link className="btn btn-danger ms-2" href={'/dashboard/pengguna'}>kembali</Link>
    </div>
  );
}
