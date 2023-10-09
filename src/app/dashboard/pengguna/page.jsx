"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import supabase from "@/app/utils/supabase";
import Link from "next/link";

export default function page() {
  const [pengguna, setPengguna] = useState([]);

  const getPengguna = () => {
    supabase
      .from("pengguna")
      .select()
      .order("created_at", { ascending: false })
      .then((result) => {
        setPengguna(result.data);
      });
  };

  useEffect(() => {
    getPengguna()
  },[])

  useEffect(() => {
    const channel = supabase.channel('realtime pengguna').on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'pengguna'
    }, (payload) => {
      getPengguna();
    }).on('postgres_changes', {
      event: 'UPDATE', schema: 'public', table: 'pengguna'
    }, (payload) => {
      getPengguna();
    }).on('postgres_changes', {
      event: 'DELETE', schema: 'public', table: 'pengguna'
    }, (payload) => {
      getPengguna();
    }).subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase]);

  const hapuspengguna = async(id) => {
    if(confirm('Yakin menghapus pengguna')) {
      await supabase.from('pengguna')
      .delete().eq('username',id);
    } else {
      console.log('tidak');
    }

    // await getPengguna()
  }

  console.log(pengguna);
  return (
    <div className="container">
      <Link href={'/dashboard/pengguna/add'} className="btn btn-primary my-1">
        Tambah data
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Username</th>
            <th scope="col">Passowrd</th>
            <th scope="col">Role</th>
            <th scope="col">Nis</th>
            <th scope="col">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pengguna.length !== 0 ?
            pengguna.map((j, index) => (
              <tr key={index}>
                <td scope="row">{index + 1}</td>
                <td>{j.username}</td>
                <td>{j.password}</td>
                <td>{j.role}</td>
                <td>{j.nis}</td>
                <td><button className="btn btn-danger" onClick={() => hapuspengguna(j.username)}>Hapus</button> || <Link href={`/dashboard/pengguna/${j.username}`} className="btn btn-success">Edit</Link></td>
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
