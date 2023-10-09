"use client";
import supabase from "@/app/utils/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function TambahKelas() {
  // crud need
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [jurusan, setJurusan] = useState([]);
  const getJurusan = () => {
    supabase
      .from("jurusan")
      .select("id,nama,deskripsi,singkatan")
      .order("created_at", { ascending: false })
      .then((result) => {
        setJurusan(result.data);
      });
  };

  const [kodeKelas, setKodeKelas] = useState("");
  const [tingkatKelas, setTingkatKelas] = useState("");
  const [jurusanKelas, setJurusanKelas] = useState("");
  const [kodeKelasTambahan, setKodeKelasTambahan] = useState("");

  useEffect(() => {
    getJurusan();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("realtime jurusan")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "jurusan",
        },
        (payload) => {
          getJurusan();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "jurusan",
        },
        (payload) => {
          getJurusan();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "jurusan",
        },
        (payload) => {
          getJurusan();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
    const simpanKelas = async(e)=> {
      e.preventDefault();
      setIsLoading(true);
      setMessage("");

      if(kodeKelas === ""){
        setMessage("Please add kodeKelas");
        setIsLoading(false)
        return;
      }

      if(tingkatKelas === ""){
        setMessage("Please add tingkat kelas");
        setIsLoading(false)
        return;
      }

      if(jurusanKelas === ""){
        setMessage("Please add jurusan kelas");
        setIsLoading(false)
        return;
      }

      if(kodeKelasTambahan === ""){
        setMessage("Please add kode kelas tambahan");
        setIsLoading(false)
        return;
      }

      

      try {
        const res = await supabase.from("kelas").insert({
          kode_kelas : kodeKelas + kodeKelasTambahan,
          tingkat : tingkatKelas,
          jurusan_id: jurusanKelas
        });
        if(res.status == 201) {  
          setKodeKelas("");
          setKodeKelasTambahan("");
          setTingkatKelas("");
          setJurusanKelas("Kelas created success fully..!");
          router.push('/dashboard/kelas');
      setIsLoading(false);
        } else {
          setMessage(res.error.message + ' (Kemungkinan kode kelas telah di pakai)');
            setIsLoading(false);
            true;
        }
       
      } catch (error) {
        console.log(error);
      }
      
  }

  const tingkatKelasHandel = (e) => {
    setTingkatKelas(e.target.value);
    if(jurusanKelas === "") {

        setKodeKelas(e.target.value + jurusanKelas);
    } else {

        const tempJus = jurusan.filter((j) => {
            return j.id == jurusanKelas;
          });
          console.log(tempJus);
          setKodeKelas(e.target.value + tempJus[0].singkatan);
    }
  };

  const handleChangeJurusan = (e) => {

    const tempJus = jurusan.filter((j) => {
      return j.id == e.target.value;
    });
    setJurusanKelas(e.target.value);
    console.log(tempJus);
    setKodeKelas(tingkatKelas + tempJus[0].singkatan);
  };

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

      <div className="mb-3 row">
        <div className="col">
          <label htmlFor="namajurusan" className="form-label">
            Kode Kelas
          </label>
          <input
            type="text"
            className="form-control"
            id="namajurusan"
            aria-describedby="emailHelp"
            placeholder="Kode Kelas"
            readOnly
            value={kodeKelas}
            onChange={(e) => setKodeKelas(e.target.value)}
          />
        </div>
        <div className="col">
          <label htmlFor="kodejurusantambahan" className="form-label">
            Kode Kelas Tambahan
          </label>
          <input
            type="text"
            className="form-control"
            id="kodejurusantambahan"
            aria-describedby="emailHelp"
            placeholder="Kode Kelas Tambahan"
            value={kodeKelasTambahan}
            onChange={(e) => setKodeKelasTambahan(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="namajurusan" className="form-label">
          Tingkat Kelas
        </label>
        <select
          className="form-select"
          aria-label="Default select example"
          defaultValue={tingkatKelas}
          onChange={tingkatKelasHandel}
        >
          <option value={""}>Pilih Tingkat Kelas</option>
          <option value={"X"}>X</option>
          <option value={"XI"}>XI</option>
          <option value={"XII"}>XII</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="namajurusan" className="form-label">
          Jurusan
        </label>
        <select
          className="form-select"
          aria-label="Default select example"
          value={jurusanKelas}
          onChange={handleChangeJurusan}
        >
          <option value={""}>Pilih Tingkat Kelas</option>
          {jurusan.length !== 0 &&
            jurusan.map((j, index) => (
              <option key={index} value={j.id}>
                {j.nama}
              </option>
            ))}
        </select>
      </div>

      <button className="btn btn-primary " onClick={simpanKelas}>Simpan kelas</button>
      <Link className="btn btn-danger ms-2" href={'/dashboard/kelas'}>kembali</Link>
    </div>
  );
}
