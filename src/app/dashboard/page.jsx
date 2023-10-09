"use client";
import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import StatistikSpp from "../components/StatistikSpp";
import supabase from "../utils/supabase";

export default function Dashboard() {
  const [dataKelas10, setDataKelas10] = useState([]);
  const [dataKelas11, setDataKelas11] = useState([]);
  const [dataKelas12, setDataKelas12] = useState([]);

  const getDataSpp = () => {
    // kelas 10
    supabase
      .from("bayar_spp")
      .select(
        "kode_bayar_spp,kode_spp(nominal,tingkat,kode_spp),nis(nis),juli,agustus,september,oktober, november,desember,januari,februari,maret,april,mei,juni,total_spp"
      )
      .eq("kode_spp.tingkat", "X")
      .order("created_at", { ascending: false })
      .then((res) => {
        let tester;
        tester = res.data.filter((response) => {
          return response.kode_spp !== null;
        });

        setDataKelas10(tester);
      });

      //kelas 11
      supabase
      .from("bayar_spp")
      .select(
        "kode_bayar_spp,kode_spp(nominal,tingkat,kode_spp),nis(nis),juli,agustus,september,oktober, november,desember,januari,februari,maret,april,mei,juni,total_spp"
      )
      .eq("kode_spp.tingkat", "XI")
      .order("created_at", { ascending: false })
      .then((res) => {
        let tester11;
        tester11 = res.data.filter((response) => {
          return response.kode_spp !== null;
        });

        setDataKelas11(tester11);
      });

      //kelas 11
      supabase
      .from("bayar_spp")
      .select(
        "kode_bayar_spp,kode_spp(nominal,tingkat,kode_spp),nis(nis),juli,agustus,september,oktober, november,desember,januari,februari,maret,april,mei,juni,total_spp"
      )
      .eq("kode_spp.tingkat", "XII")
      .order("created_at", { ascending: false })
      .then((res) => {
        let tester12;
        tester12 = res.data.filter((response) => {
          return response.kode_spp !== null;
        });

        setDataKelas12(tester12);
      });
  };

  useEffect(() => {
    getDataSpp();
    console.log("running");
  }, []);

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
          getDataSpp();
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
          getDataSpp();
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
          getDataSpp();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <>
      <div className="container">
        <div className="row justify-content-between">
          {dataKelas10.length !== 0 && (
            <StatistikSpp kelas={"Kelas 10"} data={dataKelas10} />
          )}
          {dataKelas11.length !== 0 && (
            <StatistikSpp kelas={"Kelas 11"} warna={true} data={dataKelas11} />
          )}
          {dataKelas11.length !== 0 && (
            <StatistikSpp kelas={"Kelas 12"} data={dataKelas12} />
          )}
        </div>
      </div>
    </>
  );
}
