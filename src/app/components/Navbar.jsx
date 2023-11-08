'use client'
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Navbar = () => {
  const router = useRouter();
  const {data : session, status} = useSession();
  console.log(session);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          SPP BN666
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" href="/dashboard">
                Home
              </Link>
            </li>

            {session?.user?.role !== 'KEPALA SEKOLAH' && (
              <>
              
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Master Data
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
                >
                {session?.user?.role === 'admin' && (
                  <>
                  
                <li>
                  <Link className="dropdown-item" href="/dashboard/pengguna">
                    Pengguna
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/dashboard/jurusan">
                    Jurusan
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/dashboard/kelas">
                    Kelas
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/dashboard/spp">
                    SPP
                  </Link>
                </li>
                  </>
                )}
                
                <li>
                  <Link className="dropdown-item" href="/dashboard/siswa">
                    Siswa
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" href="/dashboard/bayar_spp">
                    Pembayaran Spp
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Transaksi
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <Link className="dropdown-item" href="/dashboard/pembayaran">
                    Pembayaran SPP
                  </Link>
                </li>
              </ul>
            </li>
              </>
            ) }


            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Laporan
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <Link className="dropdown-item" href="/dashboard/laporan/siswa">
                    Siswa
                  </Link>
                </li>
               
                <li>
                  <Link className="dropdown-item" href="/dashboard/laporan/kelas">
                    Kelas
                  </Link>
                </li>
                

                <li>
                  <Link className="dropdown-item" href="/dashboard/laporan/bayar_spp">
                    Pembayaran Spp
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" aria-current="page" href="/dashboard/setting">
                Setting Aplikasi
              </Link>
            </li>

            
          </ul>
          
          <button className="btn btn-secondary ms-1 ms-auto" onClick={() => {
            if(confirm('Yakin logout')) {

              signOut().then(
                
                router.push('/')
              )

            }
            }}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
