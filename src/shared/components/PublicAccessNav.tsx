"use client";

import { authService } from "@/modules/auth/services/auth.service";
import {
  SESSION_CHANGED_EVENT,
  sessionService,
} from "@/modules/auth/services/session.service";
import { Navbar } from "@tecnologias-orbita/orbita-ui-react";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import HorizontalLinksList from "../ui/lists/HorizontalList";

interface Props {
  logo: React.ReactNode;
  mobileLogo?: React.ReactNode;
}

export function PublicAccessNav({ logo, mobileLogo }: Props) {
  const [access, setAccess] = useState<{ label: string; href: string } | null>(
    null,
  );
  const [checkingSession, setCheckingSession] = useState(true);
  const [logoVisible, setLogoVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoRef = useRef(logoVisible);

  useEffect(() => {
    let isActive = true;
    const updateAccess = async () => {
      setAccess(null);
      const session = sessionService.get();
      if (!session) {
        if (isActive) setCheckingSession(false);
        return;
      }
      if (isActive) setCheckingSession(true);
      try {
        const user = await authService.getCurrentUser(session.access_token);
        if (!isActive) return;
        if (user.is_platform_admin) {
          setAccess({ label: "Admin", href: "/admin" });
          return;
        }
        const businesses = await authService.listManagedBusinesses();
        if (isActive && businesses[0])
          setAccess({
            label: "Administrar mi negocio",
            href: `/admin/businesses/${businesses[0].id}`,
          });
      } catch {
        sessionService.clear();
      } finally {
        if (isActive) setCheckingSession(false);
      }
    };
    void updateAccess();
    window.addEventListener(SESSION_CHANGED_EVENT, updateAccess);
    window.addEventListener("storage", updateAccess);
    return () => {
      isActive = false;
      window.removeEventListener(SESSION_CHANGED_EVENT, updateAccess);
      window.removeEventListener("storage", updateAccess);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const navbar = document.querySelector(".__navbar");
      const inTop = !navbar?.getBoundingClientRect().top;
      if (logoRef.current !== inTop) setLogoVisible(inTop);
    };

    window.addEventListener("DOMContentLoaded", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("DOMContentLoaded", onScroll);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    logoRef.current = logoVisible;
  }, [logoVisible]);

  if (checkingSession) return null;

  const isMobile = window.matchMedia("(max-width: 512px)").matches;
  const actualLogo = isMobile ? (mobileLogo ?? logo) : logo;

  const items = access
    ? [
        { text: access.label, href: access.href },
        { text: "Cerrar sesión", href: "/logout", active: true },
      ]
    : [
        { text: "Publicar mi negocio", href: "/bisne/new" },
        { text: "Iniciar sesión", href: "/login", active: true },
      ];

  return (
    <Navbar.Container
      autoControlled={false}
      className={
        "__navbar bg-[none] shadow-none justify-between items-center border-none"
      }
    >
      <Navbar.Logo
        className={twMerge(
          "opacity-0 transition-all delay-200 duration-200",
          logoVisible && "opacity-100",
        )}
      >
        {actualLogo}
      </Navbar.Logo>

      {isMobile ? (
        <></>
      ) : (
        <HorizontalLinksList items={items} className="shadow-lg" />
      )}
    </Navbar.Container>
  );
}
