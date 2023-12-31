"use client";
import { rupiah } from "@/app/utils/helperFunction";
import supabase from "@/app/utils/supabase";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { usePDF } from "react-to-pdf";
import { useSession } from "next-auth/react";

export default function Kode_bayar_spp_transaksi({ params }) {
  
  const {data : session, status} = useSession();

  console.log('data sesion : ' , session);
  
  const [singelPembayaran, setSinglePembayaran] = useState([]);
  const [urlSend, setUrlSend] = useState('');
  const [detailPembayaran,setDetailPembayaran] = useState([]);

  
  const getSinglePembayaran = () => {
    supabase
    .from("bayar_spp")
    .select(
      "kode_bayar_spp,kode_spp(nominal,kode_spp),nis(nis,email_wali,nama_siswa,nama_wali,kode_kelas(kode_kelas,jurusan_id(nama))),juli,agustus,september,oktober, november,desember,januari,februari,maret,april,mei,juni"
      )
      .eq("kode_bayar_spp", params.kodebayar)
      .single()
      .then((result) => {
        setSinglePembayaran(result.data);
        
        supabase.from('detail_pembayaran').select('*').eq('kode_bayar_spp',result.data.kode_bayar_spp).then(
          (result) => {
            setDetailPembayaran(result.data);
            console.log('detail bayar : ',result.data);
          }
        )
        console.log(result);
      });
    };
    
    

  useEffect(() => {
    getSinglePembayaran();
    setUrlSend(window.location.hostname);
  }, []);

  console.log(urlSend);

  

  console.log(singelPembayaran);

  useEffect(() => {
    const channel = supabase
      .channel("realtime bayar_spp")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bayar_spp",
        },
        (payload) => {
          getSinglePembayaran();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bayar_spp",
        },
        (payload) => {
          getSinglePembayaran();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bayar_spp",
        },
        (payload) => {
          getSinglePembayaran();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  console.log(singelPembayaran);

  const bayarSppHandle = async (bulan) => {
    let res,detailRes;
    if (confirm("Yakin menghapus kelas")) {
      switch (bulan) {
        case "juli":
          res = await supabase
            .from("bayar_spp")
            .update({
              juli: singelPembayaran?.kode_spp?.nominal,
              bulan_terakhir_bayar: 'juli'

            })
            .eq("kode_bayar_spp", params.kodebayar);
            console.log(res?.data);

            detailRes = await supabase.from("detail_pembayaran").insert({
              kode_bayar_spp : singelPembayaran?.kode_bayar_spp,
              username : session?.user?.email,
              bulan_bayar : 'juli'
            })

            console.log("detail res : ", detailRes);
            await sendEMail(res,"juli",singelPembayaran?.nis?.email_wali,rupiah(singelPembayaran?.kode_spp?.nominal))
          break;
        case "agustus":
          res = await supabase
            .from("bayar_spp")
            .update({
              agustus: singelPembayaran?.kode_spp?.nominal,
              bulan_terakhir_bayar: 'agustus'
            })
            .eq("kode_bayar_spp", params.kodebayar);
            console.log(res?.data);

            detailRes = await supabase.from("detail_pembayaran").insert({
              kode_bayar_spp : singelPembayaran?.kode_bayar_spp,
              username : session?.user?.email,
              bulan_bayar : 'agustus'
            })

            console.log("detail res : ", detailRes);
            await sendEMail(res,"agustus",singelPembayaran?.nis?.email_wali,rupiah(singelPembayaran?.kode_spp?.nominal))
          break;
        case "september":
          res = await supabase
            .from("bayar_spp")
            .update({
              september: singelPembayaran?.kode_spp?.nominal,
              bulan_terakhir_bayar: 'september',
              status: 'Lunas UTS Smester 1'
            })
            .eq("kode_bayar_spp", params.kodebayar);
            console.log(res?.data);

            detailRes = await supabase.from("detail_pembayaran").insert({
              kode_bayar_spp : singelPembayaran?.kode_bayar_spp,
              username : session?.user?.email,
              bulan_bayar : 'september'
            })

            console.log("detail res : ", detailRes);
            await sendEMail(res,"september",singelPembayaran?.nis?.email_wali,rupiah(singelPembayaran?.kode_spp?.nominal))
          break;
        case "oktober":
          res = await supabase
            .from("bayar_spp")
            .update({
              oktober: singelPembayaran?.kode_spp?.nominal,
              bulan_terakhir_bayar: 'oktober',
            })
            .eq("kode_bayar_spp", params.kodebayar);
            console.log(res?.data);

            detailRes = await supabase.from("detail_pembayaran").insert({
              kode_bayar_spp : singelPembayaran?.kode_bayar_spp,
              username : session?.user?.email,
              bulan_bayar : 'oktober'
            })

            console.log("detail res : ", detailRes);
            await sendEMail(res?.data,"oktober",singelPembayaran?.nis?.email_wali,rupiah(singelPembayaran?.kode_spp?.nominal))
          break;
        case "november":
          res = await supabase
            .from("bayar_spp")
            .update({
              november: singelPembayaran?.kode_spp?.nominal,
              bulan_terakhir_bayar: 'november',
            })
            .eq("kode_bayar_spp", params.kodebayar);

          console.log(res?.data);

          detailRes = await supabase.from("detail_pembayaran").insert({
            kode_bayar_spp : singelPembayaran?.kode_bayar_spp,
            username : session?.user?.email,
            bulan_bayar : 'november'
          })

          console.log("detail res : ", detailRes);
          await sendEMail(res,"november",singelPembayaran?.nis?.email_wali,rupiah(singelPembayaran?.kode_spp?.nominal))
          break;
        case "desember":
          res = await supabase
            .from("bayar_spp")
            .update({
              desember: singelPembayaran?.kode_spp?.nominal,
              bulan_terakhir_bayar: 'desember',
              status: 'Lunas UAS Smester 1'
            })
            .eq("kode_bayar_spp", params.kodebayar);
            console.log(res?.data);

            detailRes = await supabase.from("detail_pembayaran").insert({
              kode_bayar_spp : singelPembayaran?.kode_bayar_spp,
              username : session?.user?.email,
              bulan_bayar : 'desember'
            })

            console.log("detail res : ", detailRes);
            await sendEMail(res,"desember",singelPembayaran?.nis?.email_wali,rupiah(singelPembayaran?.kode_spp?.nominal))
          break;
        case "januari":
          res = await supabase
            .from("bayar_spp")
            .update({
              januari: singelPembayaran?.kode_spp?.nominal,
              bulan_terakhir_bayar: 'januari',
            })
            .eq("kode_bayar_spp", params.kodebayar);
            console.log(res?.data);

            detailRes = await supabase.from("detail_pembayaran").insert({
              kode_bayar_spp : singelPembayaran?.kode_bayar_spp,
              username : session?.user?.email,
              bulan_bayar : 'januari'
            })

            console.log("detail res : ", detailRes);
            await sendEMail(res,"januari",singelPembayaran?.nis?.email_wali,rupiah(singelPembayaran?.kode_spp?.nominal))
          break;
        case "februari":
          res = await supabase
            .from("bayar_spp")
            .update({
              februari: singelPembayaran?.kode_spp?.nominal,
              bulan_terakhir_bayar: 'februari',
            })
            .eq("kode_bayar_spp", params.kodebayar);
            console.log(res?.data);
            detailRes = await supabase.from("detail_pembayaran").insert({
              kode_bayar_spp : singelPembayaran?.kode_bayar_spp,
              username : session?.user?.email,
              bulan_bayar : 'februari'
            })

            console.log("detail res : ", detailRes);
            await sendEMail(res,"februari",singelPembayaran?.nis?.email_wali,rupiah(singelPembayaran?.kode_spp?.nominal))
          break;
        case "maret":
          res = await supabase
            .from("bayar_spp")
            .update({
              maret: singelPembayaran?.kode_spp?.nominal,
              bulan_terakhir_bayar: 'maret',
              status: 'Lunas UTS Smester 2'
            })
            .eq("kode_bayar_spp", params.kodebayar);
            console.log(res?.data);

            detailRes = await supabase.from("detail_pembayaran").insert({
              kode_bayar_spp : singelPembayaran?.kode_bayar_spp,
              username : session?.user?.email,
              bulan_bayar : 'maret'
            })

            console.log("detail res : ", detailRes);
            await sendEMail(res,"maret",singelPembayaran?.nis?.email_wali,rupiah(singelPembayaran?.kode_spp?.nominal))
          break;
        case "april":
          res = await supabase
            .from("bayar_spp")
            .update({
              april: singelPembayaran?.kode_spp?.nominal,
              bulan_terakhir_bayar: 'april',
            })
            .eq("kode_bayar_spp", params.kodebayar);

            detailRes = await supabase.from("detail_pembayaran").insert({
              kode_bayar_spp : singelPembayaran?.kode_bayar_spp,
              username : session?.user?.email,
              bulan_bayar : 'april'
            })

            console.log("detail res : ", detailRes);

            if(res.status === 204 ) {

              await sendEMail(res,"mei",singelPembayaran?.nis?.email_wali,rupiah(singelPembayaran?.kode_spp?.nominal))
            }
          break;
        case "mei":
          res = await supabase
            .from("bayar_spp")
            .update({
              mei: singelPembayaran?.kode_spp?.nominal,
              bulan_terakhir_bayar: 'mei',
            })
            .eq("kode_bayar_spp", params.kodebayar);
            console.log(res?.data);
            detailRes = await supabase.from("detail_pembayaran").insert({
              kode_bayar_spp : singelPembayaran?.kode_bayar_spp,
              username : session?.user?.email,
              bulan_bayar : 'mei'
            })

            console.log("detail res : ", detailRes);
            if(res.status === 204 ) {

              await sendEMail(res,"mei",singelPembayaran?.nis?.email_wali,rupiah(singelPembayaran?.kode_spp?.nominal))
            }
          break;
        case "juni":
          res = await supabase
            .from("bayar_spp")
            .update({
              juni: singelPembayaran?.kode_spp?.nominal,
              bulan_terakhir_bayar: 'juni',
              status: 'Lunas UAS Smester 2'
            })
            .eq("kode_bayar_spp", params.kodebayar);
            console.log(res?.data);
            detailRes = await supabase.from("detail_pembayaran").insert({
              kode_bayar_spp : singelPembayaran?.kode_bayar_spp,
              username : session?.user?.email,
              bulan_bayar : 'juni'
            })

            console.log("detail res : ", detailRes);
            await sendEMail(res?.data,"juni",singelPembayaran?.nis?.email_wali,rupiah(singelPembayaran?.kode_spp?.nominal))
          break;
      }
    } else {
      console.log("tidak");
    }

    console.log(res);
  };

  const sendEMail = async (res, bulan, penerima,nominal) => {

    console.log('res di sending : ',res);
    

      const total_spp = rupiah(
        singelPembayaran?.juli +
          singelPembayaran?.agustus +
          singelPembayaran?.september +
          singelPembayaran?.oktober +
          singelPembayaran?.november +
          singelPembayaran?.desember +
          singelPembayaran?.januari +
          singelPembayaran?.februari +
          singelPembayaran?.maret +
          singelPembayaran?.april +
          singelPembayaran?.mei +
          singelPembayaran?.juni + singelPembayaran?.kode_spp?.nominal
      );
      const total_uts1 = rupiah(singelPembayaran?.kode_spp?.nominal * 3);
      const total_uas1 = rupiah(singelPembayaran?.kode_spp?.nominal * 6);
      const total_uts2 = rupiah(singelPembayaran?.kode_spp?.nominal * 9);
      const total_uas2 = rupiah(singelPembayaran?.kode_spp?.nominal * 12);
  
      const sending = await emailjs.send("service_2tk0fuf", "template_8gseovo", {
        nama_siswa: singelPembayaran?.nis.nama_siswa,
        bulan_bayar: bulan,
        reply_to: penerima,
        nominal,
        nama_wali : singelPembayaran?.nis?.nama_wali,
        total_spp,
        total_uts1,
        total_uas1,
        total_uts2,
        total_uas2,
        linkspp : urlSend + '/umum/'+singelPembayaran?.kode_bayar_spp
      },'lqQNmGqd4E8EneUPo');
      console.log(sending);
    


  };
  const { toPDF, targetRef } = usePDF({filename: `Kartu Spp ${singelPembayaran?.nis?.nama_siswa}.pdf`});
  return (
    <div className="container">
      {singelPembayaran?.length !== 0 ? (
        <>
        
      <button onClick={() => toPDF()} className="btn btn-info d-block my-2">Download PDF</button>
        <div className="row border" ref={targetRef}>
          <div className="col-md-12">
            <div className="row border-bottom pb-2">
              <div className="col-3 position-relative">
                <Image
                  src="/logoyayasan.png"
                  alt=".."
                  width={200}
                  height={200}
                  objectFit="center"
                />
              </div>
              <div className="col-9">
                <div className="row">
                  <div className="col-12">
                    <p align="center">
                      Yayasan Pendidikan Dasar Dan Menengah BAKTINUSANTARA 666
                    </p>
                  </div>
                  <div className="col-12">
                    <h3 align="center">SMK BAKTI NUSANTARA 666</h3>
                  </div>
                  <div className="col-12">
                    <p align="center">Terakreditasi A</p>
                  </div>
                  <div className="col-12">
                    <p align="center">
                      Jl. Percobaan No. 65 Cileunyi Kab. Bandung (022)70721934
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="row">
              <div className="col-12 text-center">
                <h3>Kartu Pembayaran SPP</h3>
              </div>
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <p>
                      Nama &nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                      {singelPembayaran?.nis.nama_siswa}
                    </p>
                  </div>
                  <div className="col-6">
                    <p>
                      Kelas &nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                      {singelPembayaran?.nis.kode_kelas.kode_kelas}
                    </p>
                    <p>
                      Jurusan :{" "}
                      {singelPembayaran?.nis.kode_kelas.jurusan_id.nama}
                    </p>
                    <p>
                      SPP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                      {rupiah(singelPembayaran?.kode_spp?.nominal)} / Bulan
                    </p>
                  </div>
                  <div className="col-6">
                    <p>
                      Total SPP terbayar :{" "}
                      {rupiah(
                        singelPembayaran?.juli +
                          singelPembayaran?.agustus +
                          singelPembayaran?.september +
                          singelPembayaran?.oktober +
                          singelPembayaran?.november +
                          singelPembayaran?.desember +
                          singelPembayaran?.januari +
                          singelPembayaran?.februari +
                          singelPembayaran?.maret +
                          singelPembayaran?.april +
                          singelPembayaran?.mei +
                          singelPembayaran?.juni
                      )}
                    </p>
                    <p>
                      SPP UTS SMESTER 1 : {rupiah(singelPembayaran?.kode_spp?.nominal * 3)}
                    </p>
                    <p>
                      SPP UAS SMESTER 1 : {rupiah(singelPembayaran?.kode_spp?.nominal * 6)}
                    </p>

                    <p>
                      SPP UTS SMESTER 2 : {rupiah(singelPembayaran?.kode_spp?.nominal * 9)}
                    </p>

                    <p>
                      SPP UAS SMESTER 2 : {rupiah(singelPembayaran?.kode_spp?.nominal * 12)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="row p-1">
              <div className="col-md-3 border">
                <div className="row">
                  <div className="col-12 text-center border-bottom">JULI</div>
                  <div
                    className="col-12 border-start border-end border-top centeringButton"
                    style={{ height: 150, position: 'relative' }}
                  >
                    {singelPembayaran?.juli !== null ? (
                      <div className="" style={{position: 'relative'}}>

                        <Image src={'/lunas.png'} height="200" width="200" style={{objectFit: "contain"}} alt=".."/>
                      </div>
                    ) : (
                      <button
                        className="btn btn-success"
                        onClick={() => bayarSppHandle("juli")}
                      >
                        Bayar Spp
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-3 border">
                <div className="row">
                  <div className="col-12 text-center border-bottom">
                    AGUSTUS
                  </div>
                  <div
                    className="col-12 border-start border-end border-top centeringButton"
                    style={{ height: 150 }}
                  >
                    {singelPembayaran?.agustus !== null ? (
                      <div className="" style={{position: 'relative'}}>

                        <Image src={'/lunas.png'} height="200" width="200" style={{objectFit: "contain"}} alt=".."/>
                      </div>
                    ) : (
                      <button
                        className="btn btn-success"
                        disabled={singelPembayaran?.juli === null && true}
                        onClick={() => bayarSppHandle("agustus")}
                      >
                        Bayar Spp
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-3 border">
                <div className="row">
                  <div className="col-12 text-center border-bottom">
                    SEPTEMBER
                  </div>
                  <div
                    className="col-12 border-start border-end border-top centeringButton"
                    style={{ height: 150 }}
                  >
                    {singelPembayaran?.september !== null ? (
                      <div className="" style={{position: 'relative'}}>

                        <Image src={'/lunas.png'} height="200" width="200" style={{objectFit: "contain"}} alt=".."/>
                      </div>
                    ) : (
                      <button
                        className={`btn btn-success`}
                        disabled={singelPembayaran?.agustus === null && true}
                        onClick={() => bayarSppHandle("september")}
                      >
                        Bayar Spp
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-3 border">
                <div className="row">
                  <div className="col-12 text-center border-bottom">
                    OKTOBER
                  </div>
                  <div
                    className="col-12 border-start border-end border-top centeringButton"
                    style={{ height: 150 }}
                  >
                    {singelPembayaran?.oktober !== null ? (
                      <div className="" style={{position: 'relative'}}>

                        <Image src={'/lunas.png'} height="200" width="200" style={{objectFit: "contain"}} alt=".."/>
                      </div>
                    ) : (
                      <button
                        className="btn btn-success"
                        disabled={singelPembayaran?.september === null && true}
                        onClick={() => bayarSppHandle("oktober")}
                      >
                        Bayar Spp
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-3 border">
                <div className="row">
                  <div className="col-12 text-center border-bottom">
                    NOVEMBER
                  </div>
                  <div
                    className="col-12 border-start border-end border-top centeringButton"
                    style={{ height: 150 }}
                  >
                    {singelPembayaran?.november !== null ? (
                      <div className="" style={{position: 'relative'}}>

                        <Image src={'/lunas.png'} height="200" width="200" style={{objectFit: "contain"}} alt=".."/>
                      </div>
                    ) : (
                      <button
                        className="btn btn-success"
                        disabled={singelPembayaran?.oktober === null && true}
                        onClick={() => bayarSppHandle("november")}
                      >
                        Bayar Spp
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-3 border">
                <div className="row">
                  <div className="col-12 text-center border-bottom">
                    DESEMBER
                  </div>
                  <div
                    className="col-12 border-start border-end border-top centeringButton"
                    style={{ height: 150 }}
                  >
                    {singelPembayaran?.desember !== null ? (
                      <div className="" style={{position: 'relative'}}>

                        <Image src={'/lunas.png'} height="200" width="200" style={{objectFit: "contain"}} alt=".."/>
                      </div>
                    ) : (
                      <button
                        className="btn btn-success"
                        disabled={singelPembayaran?.november === null && true}
                        onClick={() => bayarSppHandle("desember")}
                      >
                        Bayar Spp
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-3 border">
                <div className="row">
                  <div className="col-12 text-center border-bottom">
                    JANUARI
                  </div>
                  <div
                    className="col-12 border-start border-end border-top centeringButton"
                    style={{ height: 150 }}
                  >
                    {singelPembayaran?.januari !== null ? (
                      <div className="" style={{position: 'relative'}}>

                        <Image src={'/lunas.png'} height="200" width="200" style={{objectFit: "contain"}} alt=".."/>
                      </div>
                    ) : (
                      <button
                        className="btn btn-success"
                        disabled={singelPembayaran?.desember === null && true}
                        onClick={() => bayarSppHandle("januari")}
                      >
                        Bayar Spp
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-3 border">
                <div className="row">
                  <div className="col-12 text-center border-bottom">
                    FEBRUARI
                  </div>
                  <div
                    className="col-12 border-start border-end border-top centeringButton"
                    style={{ height: 150 }}
                  >
                    {singelPembayaran?.februari !== null ? (
                      <div className="" style={{position: 'relative'}}>

                        <Image src={'/lunas.png'} height="200" width="200" style={{objectFit: "contain"}} alt=".."/>
                      </div>
                    ) : (
                      <button
                        className="btn btn-success"
                        disabled={singelPembayaran?.januari === null && true}
                        onClick={() => bayarSppHandle("februari")}
                      >
                        Bayar Spp
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-3 border">
                <div className="row">
                  <div className="col-12 text-center border-bottom">MARET</div>
                  <div
                    className="col-12 border-start border-end border-top centeringButton"
                    style={{ height: 150 }}
                  >
                    {singelPembayaran?.maret !== null ? (
                      <div className="" style={{position: 'relative'}}>

                        <Image src={'/lunas.png'} height="200" width="200" style={{objectFit: "contain"}} alt=".."/>
                      </div>
                    ) : (
                      <button
                        className="btn btn-success"
                        disabled={singelPembayaran?.februari === null && true}
                        onClick={() => bayarSppHandle("maret")}
                      >
                        Bayar Spp
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-3 border">
                <div className="row">
                  <div className="col-12 text-center border-bottom">APRIL</div>
                  <div
                    className="col-12 border-start border-end border-top centeringButton"
                    style={{ height: 150 }}
                  >
                    {singelPembayaran?.april !== null ? (
                      <div className="" style={{position: 'relative'}}>

                        <Image src={'/lunas.png'} height="200" width="200" style={{objectFit: "contain"}} alt=".."/>
                      </div>
                    ) : (
                      <button
                        className="btn btn-success"
                        disabled={singelPembayaran?.maret === null && true}
                        onClick={() => bayarSppHandle("april")}
                      >
                        Bayar Spp
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-3 border">
                <div className="row">
                  <div className="col-12 text-center border-bottom">MEI</div>
                  <div
                    className="col-12 border-start border-end border-top centeringButton"
                    style={{ height: 150 }}
                  >
                    {singelPembayaran?.mei !== null ? (
                      <div className="" style={{position: 'relative'}}>

                        <Image src={'/lunas.png'} height="200" width="200" style={{objectFit: "contain"}} alt=".."/>
                      </div>
                    ) : (
                      <button
                        className="btn btn-success"
                        disabled={singelPembayaran?.april === null && true}
                        onClick={() => bayarSppHandle("mei")}
                      >
                        Bayar Spp
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-3 border">
                <div className="row">
                  <div className="col-12 text-center border-bottom">JUNI</div>
                  <div
                    className="col-12 border-start border-end border-top centeringButton"
                    style={{ height: 150 }}
                  >
                    {singelPembayaran?.juni !== null ? (
                      <div className="" style={{position: 'relative'}}>

                        <Image src={'/lunas.png'} height="200" width="200" style={{objectFit: "contain"}} alt=".."/>
                      </div>
                    ) : (
                      <button
                        className="btn btn-success"
                        disabled={singelPembayaran?.mei === null && true}
                        onClick={() => bayarSppHandle("juni")}
                      >
                        Bayar Spp
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row border mt-3">
          <h2>Detail Pembayaran</h2>
          <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Kode Bayar SPP</th>
            <th scope="col">Detail Tanggal Bayar</th>
            <th scope="col">Petugas Bayar</th>
            <th scope="col">Bulan Bayar</th>
          </tr>
        </thead>
        <tbody>
          {detailPembayaran.length !== 0 ? (
            detailPembayaran.map((j, index) => (
              <tr key={index}>
                <td scope="row">{index + 1}</td>
                <td>{j.kode_bayar_spp}</td>
                <td>{j.tgl_pembayaran}</td>
                <td>{j.username}</td>
                <td>{j.bulan_bayar}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>loading...</td>
            </tr>
          )}
        </tbody>
      </table>
        </div>
        </>
      ) : (
        <div>kode tidak ada</div>
      )}
    </div>
  );
}
