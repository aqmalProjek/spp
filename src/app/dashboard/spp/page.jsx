"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import supabase from "@/app/utils/supabase";
import Link from "next/link";

export default function SppComponent() {
  const [spp, setSpp] = useState([]);

  const getSpp = () => {
    supabase
      .from("spp")
      .select()
      .order("created_at", { ascending: false })
      .then((result) => {
        setSpp(result.data);
      });
  };

  useEffect(() => {
    getSpp()
  },[])

  useEffect(() => {
    const channel = supabase.channel('realtime spp').on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'spp'
    }, (payload) => {
      getSpp();
    }).on('postgres_changes', {
      event: 'UPDATE', schema: 'public', table: 'spp'
    }, (payload) => {
      getSpp();
    }).on('postgres_changes', {
      event: 'DELETE', schema: 'public', table: 'spp'
    }, (payload) => {
      getSpp();
    }).subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase]);

  const hapusSpp = async(id) => {
    if(confirm('Yakin menghapus spp')) {
      await supabase.from('spp')
      .delete().eq('kode_spp',id);
    } else {
      console.log('tidak');
    }

    // await getSpp()
  }

  console.log(spp);
  return (
    <div className="container">
      <Link href={'/dashboard/spp/add'} className="btn btn-primary my-1">
        Tambah data
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Kode Spp</th>
            <th scope="col">tingkat</th>
            <th scope="col">nominal</th>
            <th scope="col">deskripsi</th>
            <th scope="col">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {spp.length !== 0 ?
            spp.map((j, index) => (
              <tr key={index}>
                <td scope="row">{index + 1}</td>
                <td>{j.kode_spp}</td>
                <td>{j.tingkat}</td>
                <td>{j.nominal}</td>
                <td>{j.deskripsi}</td>
                <td><button className="btn btn-danger" onClick={() => hapusSpp(j.kode_spp)}>Hapus</button> || <Link href={`/dashboard/spp/${j.kode_spp}`} className="btn btn-success">Edit</Link></td>
              </tr>
            )) : (
              <tr>
               <td colSpan={4}>loading...</td>
              </tr>
            )}
        </tbody>
      </table>
    </div>
  );
}
