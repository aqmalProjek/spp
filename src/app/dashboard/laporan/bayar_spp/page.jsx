"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import supabase from "@/app/utils/supabase";
import Link from "next/link";
import DataTable from "react-data-table-component";
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

export default function TampilBayar_spp() {
  const [bayar_spp, setBayar_spp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opsiLunas,setOpsiLunas] = useState('Semua');
  const [opsiLunasForm,setOpsiLunasForm] = useState('Semua');


  const colums = [
    {
      name: "Nomor",
      selector: 'nomor',
      sortable: true,
    },
    {
      name: "Kode Bayar Spp",
      selector: 'kode_bayar_spp',
      sortable: true,
    },
    {
      name: "Kode Spp",
      selector: 'kode_spp',
      sortable: true,
    },
    {
      name: "Nis",
      selector: 'nis',
      sortable: true,
    },
    {
      name: "Spp Perbulan",
      selector: 'nominal',
      sortable: true,
    },
  ];

  const getBayar_spp = () => {
    setBayar_spp([]);
    setLoading(true);
    supabase
      .from("bayar_spp")
      .select(
        "kode_bayar_spp,kode_spp(nominal,kode_spp),nis(nis),juli,agustus,september,oktober, november,desember,januari,februari,maret,april,mei,juni"
      )
      .order("created_at", { ascending: false })
      .then((result) => {
        result.data.map((k, index) => {
          setBayar_spp((bayar_spp) => [
            ...bayar_spp,
            {
              nomor: index + 1,
              kode_bayar_spp: k.kode_bayar_spp,
              kode_spp: k.kode_spp.kode_spp,
              nis: k.nis.nis,
              nominal: k.kode_spp.nominal
            },
          ]);
        });

       

        setLoading(false);
      });
  };

  useEffect(() => {
    getBayar_spp();
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
          getBayar_spp();
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
          getBayar_spp();
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
          getBayar_spp();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const hapusbayar_spp = async (id) => {
    if (confirm("Yakin menghapus bayar_spp")) {
      await supabase.from("bayar_spp").delete().eq("kode_bayar_spp", id);
    } else {
      console.log("tidak");
    }

    // await getBayar_spp()
  };

  console.log(bayar_spp);

  const handleCariKode = (e) => {
    let newData;
    if (e.target.value.toLowerCase().includes('s')) {

      newData = rowsRecord.filter((row) => {
       return row.kode_bayar_spp
         .toLowerCase()
         .includes(e.target.value.toLowerCase());
     });
    } else {
      newData = rowsRecord.filter((row) => {
        return row.nis
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
    }

    setBayar_spp(newData);
  }

  const tableData = {
    columns : colums,
    data : bayar_spp,
  };


  const filterLunas = (e) => {
    
    console.log(e.target.value);
    setOpsiLunasForm(e.target.value);
    if(e.target.value === "") {
      setOpsiLunas('Semua');
      supabase
      .from("bayar_spp")
      .select(
        "kode_bayar_spp,kode_spp(nominal,kode_spp),nis(nis),juli,agustus,september,oktober, november,desember,januari,februari,maret,april,mei,juni"
      )
      .order("created_at", { ascending: false })
      .then((result) => {
        result.data.map((k, index) => {
          setBayar_spp((bayar_spp) => [
            ...bayar_spp,
            {
              nomor: index + 1,
              kode_bayar_spp: k.kode_bayar_spp,
              kode_spp: k.kode_spp.kode_spp,
              nis: k.nis.nis,
              nominal: k.kode_spp.nominal
            },
          ]);
        });

       

        setLoading(false);
      });
      return;
    }
    setBayar_spp([]);

    if(e.target.value === 'uts1') {
      setOpsiLunas("LUNAS UTS SMESTER 1");
      supabase
      .from("bayar_spp")
      .select(
        "kode_bayar_spp,kode_spp(nominal,kode_spp),nis(nis),juli,agustus,september,oktober, november,desember,januari,februari,maret,april,mei,juni"
      )
      .order("created_at", { ascending: false })
      .not('september','is',null)
      .then((result) => {
        result.data.map((k, index) => {
          setBayar_spp((bayar_spp) => [
            ...bayar_spp,
            {
              nomor: index + 1,
              kode_bayar_spp: k.kode_bayar_spp,
              kode_spp: k.kode_spp.kode_spp,
              nis: k.nis.nis,
              nominal: k.kode_spp.nominal
            },
          ]);
        });

       

        setLoading(false);
      });
    } else if(e.target.value === 'uas1') {
      setOpsiLunas("LUNAS UAS SMESTER 1");
      supabase
      .from("bayar_spp")
      .select(
        "kode_bayar_spp,kode_spp(nominal,kode_spp),nis(nis),juli,agustus,september,oktober, november,desember,januari,februari,maret,april,mei,juni"
      )
      .order("created_at", { ascending: false })
      .not('desember','is',null)
      .then((result) => {
        result.data.map((k, index) => {
          setBayar_spp((bayar_spp) => [
            ...bayar_spp,
            {
              nomor: index + 1,
              kode_bayar_spp: k.kode_bayar_spp,
              kode_spp: k.kode_spp.kode_spp,
              nis: k.nis.nis,
              nominal: k.kode_spp.nominal
            },
          ]);
        });

       

        setLoading(false);
      })
    } else if(e.target.value === 'uts2') {
      setOpsiLunas("LUNAS UTS SMESTER 2");
      supabase
      .from("bayar_spp")
      .select(
        "kode_bayar_spp,kode_spp(nominal,kode_spp),nis(nis),juli,agustus,september,oktober, november,desember,januari,februari,maret,april,mei,juni"
      )
      .order("created_at", { ascending: false })
      .not('maret','is',null)
      .then((result) => {
        result.data.map((k, index) => {
          setBayar_spp((bayar_spp) => [
            ...bayar_spp,
            {
              nomor: index + 1,
              kode_bayar_spp: k.kode_bayar_spp,
              kode_spp: k.kode_spp.kode_spp,
              nis: k.nis.nis,
              nominal: k.kode_spp.nominal
            },
          ]);
        });

       

        setLoading(false);
      })
    } else if(e.target.value === 'uas2') {
      setOpsiLunas("LUNAS UAS SMESTER 2");
      supabase
      .from("bayar_spp")
      .select(
        "kode_bayar_spp,kode_spp(nominal,kode_spp),nis(nis),juli,agustus,september,oktober, november,desember,januari,februari,maret,april,mei,juni"
      )
      .order("created_at", { ascending: false })
      .not('juni','is',null)
      .then((result) => {
        result.data.map((k, index) => {
          setBayar_spp((bayar_spp) => [
            ...bayar_spp,
            {
              nomor: index + 1,
              kode_bayar_spp: k.kode_bayar_spp,
              kode_spp: k.kode_spp.kode_spp,
              nis: k.nis.nis,
              nominal: k.kode_spp.nominal
            },
          ]);
        });

       

        setLoading(false);
      })
    }

   
      
  }

  return (
    <div className="container">


<button
    type="button"
    className="btn btn-primary mt-3"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
  >
    Filter data pembayaran
  </button>
  {/* Modal */}
  <div
    className="modal fade"
    id="exampleModal"
    tabIndex={-1}
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Filter Data
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">

        <div className="mb-3">
            <label htmlFor="namajurusan" className="form-label">
              Filter berdasarkan Lunas
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              value={opsiLunasForm}
              onChange={filterLunas}
            >
              <option value={""}>Pilih opsi lunas</option>

             
                    <option  value={'uts1'}>LUNAS UTS SMESTER 1</option>
                    <option  value={'uas1'}>LUNAS UAS SMESTER 1</option>
                    <option  value={'uts2'}>LUNAS UTS SMESTER 2</option>
                    <option  value={'uas2'}>LUNAS UAS SMESTER 2</option>
                 
            </select>
          </div>


        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>

  <p className="text-warning">Filter menunjukan : {opsiLunas}</p>
      <DataTableExtensions
      {...tableData}
    >


      <DataTable
        noHeader
        defaultSortField="nomor"
        defaultSortAsc={false}
        pagination
        highlightOnHover
      ></DataTable>
    </DataTableExtensions>
    </div>
  );
}
