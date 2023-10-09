"use client";
import supabase from "@/app/utils/supabase";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function TambahDatasiswa() {
  // crud need
  const [message, setMessage] = useState("");
  const [loading, setIsLoading] = useState(false);

  const [kelas,setKelas] = useState([]);

  const getKelas = () => {
    supabase
      .from("kelas")
      .select("kode_kelas")
      .order("created_at", { ascending: false })
      .then((result) => {
        setKelas(result.data);
      });
  };

  useEffect(() => {
    getKelas();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("realtime kelas")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "kelas",
        },
        (payload) => {
          getKelas();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "kelas",
        },
        (payload) => {
          getKelas();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "kelas",
        },
        (payload) => {
          getKelas();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const [nis, setNis] = useState("");
  const [namaSiswa, setNamaSiswa] = useState("");
  const [kodeKelas, setKodeKelas] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [noSiswa, setNoSiswa] = useState("");
  const [alamat, setAlamat] = useState("");
  const [jk, setJk] = useState("");
  const [agama, setAgama] = useState("");
  const [namaWali, setNamaWali] = useState("");
  const [noWali, setNoWali] = useState("");
  const [pekerjaan, setPekerjaan] = useState("");
  const [email_wali, setEmail_wali] = useState("");

  const add = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (nis === "") {
      setMessage("Please add nis");
      setIsLoading(false);
      return;
    }

    if (namaSiswa === "") {
        setMessage("Please add namaSiswa");
        setIsLoading(false);
        return;
      }

      if (kodeKelas === "") {
        setMessage("Please add Kelas");
        setIsLoading(false);
        return;
      }

      if (angkatan === "") {
        setMessage("Please add angkatan");
        setIsLoading(false);
        return;
      }

      if (noSiswa === "") {
        setMessage("Please add noSiswa");
        setIsLoading(false);
        return;
      }

      if (alamat === "") {
        setMessage("Please add alamat");
        setIsLoading(false);
        return;
      }

      if (alamat === "") {
        setMessage("Please add alamat");
        setIsLoading(false);
        return;
      }

      if (jk === "") {
        setMessage("Please add Jenis Kelamin");
        setIsLoading(false);
        return;
      }

      if (agama === "") {
        setMessage("Please add agama");
        setIsLoading(false);
        return;
      }

      if (namaWali === "") {
        setMessage("Please add namaWali");
        setIsLoading(false);
        return;
      }

      if (noWali === "") {
        setMessage("Please add noWali");
        setIsLoading(false);
        return;
      }

      if (pekerjaan === "") {
        setMessage("Please add pekerjaan");
        setIsLoading(false);
        return;
      }
      if (email_wali === "") {
        setMessage("Please add Email Wali");
        setIsLoading(false);
        return;
      }

    try {
      const res = await supabase.from("siswa").insert({
        nis,
        nama_siswa : namaSiswa,
        kode_kelas: kodeKelas,
angkatan,
no_siswa: noSiswa,
alamat,
jenis_kelamin: jk,
agama,
nama_wali: namaWali,
no_wali: noWali,
pekerjaan,
email_wali
      });

      if(res.status == 201) {

        setNis("");
        setNamaSiswa("");
        setKodeKelas("");
        setAngkatan("");
        setNoSiswa("");
        setAlamat("");
        setJk("");
        setAgama("");
        setNamaWali("");
        setNoWali("");
        setEmail_wali("");
        setPekerjaan("");
      setMessage("siswa created success fully..!");
      } else {
        setMessage(res.error.message + ' (Kemungkinan Nis Telah Di pakai)');
        setIsLoading(false)
        return;
      }

      console.log(res);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
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
      <div className="row">
        <div className="col-md-6 ">
          <h3>Data Siswa</h3>
          <div className="mb-3">
            <label htmlFor="nis" className="form-label">
              Nis
            </label>
            <input
              type="text"
              className="form-control"
              id="nis"
              aria-describedby="emailHelp"
              placeholder="nis"
              value={nis}
              onChange={(e) => setNis(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="deskirpsi siswa" className="form-label">
              Nama Siswa
            </label>
            <input
              type="text"
              className="form-control"
              id="deskirpsi siswa"
              aria-describedby="emailHelp"
              placeholder="Deskirpsi siswa"
              value={namaSiswa}
              onChange={(e) => setNamaSiswa(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="namajurusan" className="form-label">
              Kelas
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              value={kodeKelas}
              onChange={(e) => setKodeKelas(e.target.value)}
            >
              <option value={""}>Pilih Kelas</option>

              {kelas.length !== 0 && (
                  kelas.map((k,index) => (
                    <option key={index} value={k.kode_kelas}>{k.kode_kelas}</option>
                  ))
              )}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="singkatan siswa" className="form-label">
              Angkatan
            </label>
            <input
              type="text"
              className="form-control"
              id="Singkatan siswa"
              aria-describedby="emailHelp"
              placeholder="Singkatan siswa"
              value={angkatan}
              onChange={(e) => setAngkatan(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="singkatan siswa" className="form-label">
              No Handpohone Siswa
            </label>
            <input
              type="text"
              className="form-control"
              id="Singkatan siswa"
              aria-describedby="emailHelp"
              placeholder="Singkatan siswa"
              value={noSiswa}
              onChange={(e) => setNoSiswa(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="namajurusan" className="form-label">
              Jenis Kelamin
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              value={jk}
              onChange={(e) => setJk(e.target.value)}
            >
              <option value={""}>Pilih Jenis Kelamin</option>

              <option value={"Laki-Laki"}>Laki-Laki</option>
              <option value={"Perempuan"}>Perempuan</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="singkatan siswa" className="form-label">
              Alamat
            </label>
            <input
              type="text"
              className="form-control"
              id="Singkatan siswa"
              aria-describedby="emailHelp"
              placeholder="Singkatan siswa"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="namajurusan" className="form-label">
              Agama
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              value={agama}
              onChange={(e) => setAgama(e.target.value)}
            >
              <option value={""}>Pilih Agama</option>

              <option value={"ISLAM"}>ISLAM</option>
              <option value={"KRISTEN PROTESTAN"}>KRISTEN PROTESTAN</option>
              <option value={"KRISTEN KATOLIK"}>KRISTEN KATOLIK</option>
              <option value={"HINDU"}>HINDU</option>
              <option value={"BUDHA"}>BUDHA</option>
              <option value={"KONGHUCU"}>KONGHUCU</option>
            </select>
          </div>
        </div>
        <div className="col-md-6 ">
          <h3>Data Orang Tua Siswa</h3>
          <div className="mb-3">
            <label htmlFor="singkatan siswa" className="form-label">
              Nama Wali
            </label>
            <input
              type="text"
              className="form-control"
              id="Singkatan siswa"
              aria-describedby="emailHelp"
              placeholder="Singkatan siswa"
              value={namaWali}
              onChange={(e) => setNamaWali(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="singkatan siswa" className="form-label">
              No Wali
            </label>
            <input
              type="text"
              className="form-control"
              id="Singkatan siswa"
              aria-describedby="emailHelp"
              placeholder="Singkatan siswa"
              value={noWali}
              onChange={(e) => setNoWali(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="singkatan siswa" className="form-label">
              Pekerjaan Wali
            </label>
            <input
              type="text"
              className="form-control"
              id="Singkatan siswa"
              aria-describedby="emailHelp"
              placeholder="Singkatan siswa"
              value={pekerjaan}
              onChange={(e) => setPekerjaan(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="singkatan siswa" className="form-label">
              Email Wali
            </label>
            <input
              type="email"
              className="form-control"
              id="Singkatan siswa"
              aria-describedby="emailHelp"
              placeholder="Email Wali"
              value={email_wali}
              onChange={(e) => setEmail_wali(e.target.value)}
            />
          </div>
        </div>
      </div>

      <button className="btn btn-primary " onClick={add}>
        Simpan siswa
      </button>
      <Link className="btn btn-danger ms-2" href={"/dashboard/siswa"}>
        kembali
      </Link>
    </div>
  );
}
