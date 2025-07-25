"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Flex } from ".";
import styles from "./Drawer.module.scss";
import classNames from "classnames";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <Flex
      position="fixed"
      left="0"
      right="0"
      bottom="0"
      // width="100%"
      zIndex={7} // Below navbar (assuming navbar is at 8)
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={classNames(styles.overlay, {
        [styles.open]: isOpen,
      })}
    >
      <Flex
        direction="column"
        background="surface"
        // width="100%"
        // radius="xl-t"
        border="neutral-alpha-medium"
        className={classNames(styles.drawer, {
          [styles.open]: isOpen,
        })}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </Flex>
    </Flex>,
    document.body
  );
};