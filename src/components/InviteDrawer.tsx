"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Flex, Text, IconButton } from "@/once-ui/components";
import styles from "./InviteDrawer.module.scss";
import classNames from "classnames";

export default function InviteDrawer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const inviteId = searchParams.get("id");

  useEffect(() => {
    if (inviteId) {
      setIsOpen(true);
      setDragOffset(0);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = "hidden";
    } else {
      setIsOpen(false);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [inviteId]);

  useEffect(() => {
    // Apply blur to main content when drawer is open
    const mainContent = document.querySelector('main');
    if (mainContent) {
      if (inviteId) {
        mainContent.style.filter = 'blur(4px)';
        mainContent.style.transition = 'filter 0.3s ease';
        mainContent.style.pointerEvents = 'none';
      } else {
        mainContent.style.filter = '';
        mainContent.style.transition = '';
        mainContent.style.pointerEvents = '';
      }
    }
  }, [inviteId]);

  const handleClose = () => {
    setIsOpen(false);
    // Remove only the 'id' query parameter while keeping the current path
    const url = new URL(window.location.href);
    url.searchParams.delete('id');
    router.replace(url.pathname);
  };

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart(clientY);
  };

  const handleDrag = (e: TouchEvent | MouseEvent) => {
    if (!isDragging) return;
    const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    const delta = clientY - dragStart;
    if (delta > 0) { // Only allow dragging downwards
      setDragOffset(delta);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (dragOffset > 150) { // Close if dragged down more than 150px
      handleClose();
    } else {
      setDragOffset(0);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDrag);
      window.addEventListener('touchend', handleDragEnd);

      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDrag);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging]);

  if (!inviteId) return null;

  return (
    <>
      <Flex
        position="fixed"
        left="0"
        right="0"
        bottom="0"
        top="0"
        zIndex={7}
        background="overlay"
        onClick={handleClose}
        className={classNames(styles.overlay, {
          [styles.open]: isOpen,
        })}
      />
      <Flex
        ref={drawerRef}
        position="fixed"
        left="0"
        right="0"
        bottom="0"
        direction="column"
        background="surface"
        zIndex={7}
        className={classNames(styles.drawer, {
          [styles.open]: isOpen,
          [styles.dragging]: isDragging,
        })}
        style={{
          transform: `translateY(${dragOffset}px)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Flex
          horizontal="center"
          padding="12"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          cursor="grab"
          className={styles.dragHandle}
        >
          <Flex width="32" height="4" radius="full" background="neutral-alpha-medium" />
        </Flex>

        <Flex fillWidth horizontal="space-between" vertical="center" paddingX="24" paddingBottom="16">
          <Text variant="heading-strong-l">Invite Details</Text>
          <IconButton
            icon="close"
            variant="tertiary"
            onClick={handleClose}
            tooltip="Close"
          />
        </Flex>

        <Flex direction="column" gap="24" padding="24" paddingTop="0" overflowY="auto">
          <Text>Invite ID: {inviteId}</Text>
          {/* Add your content here */}
        </Flex>
      </Flex>
    </>
  );
}