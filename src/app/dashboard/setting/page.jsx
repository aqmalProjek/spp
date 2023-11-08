"use client"
import supabase from "@/app/utils/supabase";
import React, { useEffect, useState } from "react";

export default function SettingPage() {
    const [message, setMessage] = useState("");
    const [loading, setIsLoading] = useState(false);
    const [tahunAwal, setTahunAwal] = useState('');
    const [tahunAkhir, setTahunAkhir] = useState('');
    const [namasekolah, setNamasekolah] = useState('');



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

            console.log('setting sebelum di setting : ',result.data);
          });
      };


      useEffect(() => {
        getSetting()
      },[])

      useEffect(() => {
        const channel = supabase
          .channel("realtime jurusan")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "setting",
            },
            (payload) => {
              getSetting();
            }
          )
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "setting",
            },
            (payload) => {
              getSetting();
            }
          )
          .on(
            "postgres_changes",
            {
              event: "DELETE",
              schema: "public",
              table: "setting",
            },
            (payload) => {
              getSetting();
            }
          )
          .subscribe();
    
        return () => {
          supabase.removeChannel(channel);
        };
      }, []);

      const submitHandel = async() => {
        setIsLoading(true);
        const res = await supabase.from('setting').update({
            tahun_ajaran_sekarang : `${tahunAwal}-${tahunAkhir}`,
            nama_sekolah : namasekolah
        }).eq('id',1)
        setIsLoading(false)
        console.log(res);
      }
  return (
    <div className="container">
      <h2>Setting Aplikasi</h2>

      <div className="row">
    <div className="col-2">

        <div className="input-group">
          <span className="input-group-text" id="basic-addon1">
            20
          </span>
          <input
            type="number"
            className="form-control"
            placeholder="Tahun awal"
            aria-label="Username"
            aria-describedby="basic-addon1"
            value={tahunAwal}
            onChange={e => setTahunAwal(e.target.value)}
          />
        </div>
    </div>

       /
        <div className="col-2">

        <div className=" input-group ">
          <span className="input-group-text" id="basic-addon1">
            20
          </span>
          <input
            type="number"
            className="form-control"
            placeholder="Tahun akhir"
            aria-label="Username"
            aria-describedby="basic-addon1"
            value={tahunAkhir}
            onChange={e => setTahunAkhir(e.target.value)}
          />
        </div>
        </div>

      </div>


      <div className="mb-3">
        <label htmlFor="namasekolah" className="form-label">
          Nama Sekolah
        </label>
        <input
          type="text"
          className="form-control"
          id="namasekolah"
          aria-describedby="emailHelp"
          placeholder="Nama Sekolah"
          value={namasekolah}
            onChange={e => setNamasekolah(e.target.value)}
        />
      </div>

      <button className="btn btn-success" onClick={submitHandel}>Save Setting</button>



    </div>
  );
}
