import { cn } from "../../utils/cn";
import { Link } from "react-router-dom";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX, IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt } from "@tabler/icons-react";



// Sidebar Context
const SidebarContext = createContext(undefined);
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// Sidebar Provider
export const SidebarProvider = ({ children, open: openProp, setOpen: setOpenProp, animate = true }) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;
  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Sidebar Component
export const Sidebar = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

// Sidebar Body (Wrapper for Desktop & Mobile Sidebar)
export const SidebarBody = (props) => (
  <>
    <DesktopSidebar {...props} />
    <MobileSidebar {...props} />
  </>
);

// Desktop Sidebar (Always visible, Full Height)
export const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-screen px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-black w-[300px] shrink-0 border-r border-gray-200 dark:border-gray-800 dark-transition",
        className
      )}
      animate={{ width: animate ? (open ? "300px" : "300px") : "300px" }} // Always full width
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Mobile Sidebar
export const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-black w-full dark-transition",
          className
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2 className="text-neutral-800 dark:text-gray-200" onClick={() => setOpen(!open)} />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-black p-10 z-[100] flex flex-col justify-between dark-transition",
                className
              )}
            >
              <div className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-gray-200" onClick={() => setOpen(!open)}>
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// Sidebar Link Component
export const SidebarLink = ({ link, className, ...props }) => {
  const { open, animate } = useSidebar();
  return (
    <Link
      to={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 text-neutral-700 dark:text-gray-200 hover:text-neutral-900 dark:hover:text-white dark-transition",
        className
      )}
      {...props}
    >
      {link.icon && React.cloneElement(link.icon, {
        className: cn("h-5 w-5 text-neutral-700 dark:text-gray-300", link.icon.props.className)
      })}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "inline-block") : "inline-block",
          opacity: animate ? (open ? 1 : 1) : 1,
        }}
        className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0">
        {link.label}
      </motion.span>
    </Link>
  );
};

// SidebarDemo (Merged Inside Sidebar)
export function SidebarDemo() {
  const links = [
    { label: "Dashboard", href: "/", icon: <IconBrandTabler className="h-5 w-5" /> },
    { label: "Profile", href: "/profile", icon: <IconUserBolt className="h-5 w-5" /> },
    { label: "Settings", href: "/settings", icon: <IconSettings className="h-5 w-5" /> },
    { label: "Logout", href: "/logout", icon: <IconArrowLeft className="h-5 w-5" /> },
  ];

  const [open, setOpen] = useState(false);
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-gray-700 dark:bg-black h-screen dark-transition">
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink link={{ label: "Manu Arora", href: "#", }} />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}


