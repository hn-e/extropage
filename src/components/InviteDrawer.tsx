"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Flex, Text, IconButton } from "@/once-ui/components";
import styles from "./InviteDrawer.module.scss";
import classNames from "classnames";

function InviteDrawerContent() {
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
      document.body.style.overflow = "hidden";
    } else {
      setIsOpen(false);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [inviteId]);

  const handleClose = () => {
    setIsOpen(false);
    router.replace(pathname);
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
    if (delta > 0) {
      setDragOffset(delta);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (dragOffset > 150) {
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
        top="0"
        left="0"
        right="0"
        bottom="0"
        background="overlay"
        zIndex={7}
        className={classNames(styles.overlay, { [styles.open]: isOpen })}
        onClick={handleClose}
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
          fillWidth
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

        <Flex direction="column" gap="16" padding="24" paddingTop="0" overflowY="auto">
          <Text>Invite ID: {inviteId}</Text>
          {/* Add your content here */}
        </Flex>
      </Flex>
    </>
  );
}

export default function InviteDrawer() {
  return (
    <Suspense fallback={null}>
      <InviteDrawerContent />
    </Suspense>
  );
}