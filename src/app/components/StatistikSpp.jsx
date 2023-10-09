"use client"
import React, { useEffect, useState } from 'react'
import { rupiah } from '../utils/helperFunction';

export default function StatistikSpp({kelas,data = null,warna = false}) {

  const [totalSiswa,setTotalSiswa] = useState("");
  const [nunggakUts,setNunggakUts] = useState("");
  const [nunggakUas,setNunggakUas] = useState("");
  const [nunggakUas2,setNunggakUas2] = useState("");
  const [nunggakUts2,setNunggakUts2] = useState("");
  const [totalDana,setTotalDana] = useState("");
  const [danaTerkumpul,setDanaTerkumpul] = useState("");

  useEffect(() => {

    if(data !== null) {
      console.log(`Data ${kelas} : `,data);
     setTotalSiswa(data?.length);

      let nguts = data?.filter((hasil) => {
        return hasil.september === null
       })
     setNunggakUts(nguts.length);
     let nguts2 = data?.filter((hasil) => {
      return hasil.maret === null
     })
   setNunggakUts2(nguts2.length);

     let nguas = data?.filter((hasil) => {
      return hasil.desember === null
     })
     console.log("nunggak uas smes 1 : ",nguas.length);
     setNunggakUas(nguas.length);

     let nguas2 = data?.filter((hasil) => {
      return hasil.juni === null
     })
     console.log("nunggak uas smes 1 : ",nguas.length);
     setNunggakUas2(nguas2.length);

    }

    let totDana;
    data.map((res) => {
      totDana = res.total_spp
    })

    console.log('totalDana :',totDana*data?.length);
    setTotalDana(totDana*data?.length)

    let terkumpul = 0;
    data.map((res) => {
      terkumpul = terkumpul + res?.juli +
      res?.agustus +
      res?.september +
      res?.oktober +
      res?.november +
      res?.desember +
      res?.januari +
      res?.februari +
      res?.maret +
      res?.april +
      res?.mei +
      res?.juni
    })

    console.log('terkumpul : ',terkumpul);
    setDanaTerkumpul(terkumpul);
    
  },[data])

  if(data.length === 0 ) {
    return (
      <div className={`col-md-12 my-1 border rounded ${warna !== false && 'bg-secondary'}`} >Tidak ada data {kelas}</div>
    )
  }



  return (
    <div className={`col-md-12 my-1 border rounded ${warna !== false && 'bg-secondary'}`} >
            {kelas}
            <div className="row">
              <div className="card col-5 m-1">
                <div className="card-body">
                  <h5 className="card-title">Total Siswa</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{totalSiswa}</h6>
                </div>
              </div>
              <div className="card col-5 m-1">
                <div className="card-body">
                  <h5 className="card-title">Nunggak UTS Smester 1</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{nunggakUts}</h6>
                </div>
              </div>
              <div className="card col-5 m-1">
                <div className="card-body">
                  <h5 className="card-title">Nunggak UAS Smester 2</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{nunggakUas2}</h6>
                </div>
              </div>
              <div className="card col-5 m-1">
                <div className="card-body">
                  <h5 className="card-title">Nunggak UTS Smester 2</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{nunggakUts2}</h6>
                </div>
              </div>
              <div className="card col-5 m-1">
                <div className="card-body">
                  <h5 className="card-title">Nunggak UAS Smester 1</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{nunggakUas}</h6>
                </div>
              </div>
            </div>

            <p>Total Dana diaharpakan : {rupiah(totalDana)}</p>
            <p>Total Dana Terkumpul : {rupiah(danaTerkumpul)}</p>
            <p>Total Dana Nunggak : {rupiah(totalDana - danaTerkumpul)}</p>
          </div>
  )
}
