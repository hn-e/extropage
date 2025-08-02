"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Flex, Text, IconButton, Icon, Row } from "@/once-ui/components";
import styles from "./InviteDrawer.module.scss";
import classNames from "classnames";
import { getGuestData } from '../../lib/appwrite';
import StoreBadge from "./StoreBadge";
import Link from "next/link";

function InviteDrawerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [partyDetails, setPartyDetails] = useState<PartyDetails | null>(null);
  const inviteId = searchParams.get("invite");

  type PartyDetails = {
    title: string;
    thumbnail: string;
    location: string;
    description: string;
    headcount: number;
    superLats: string[];
    preferences: string;
    date: string;
    time: string;
    type: string;
    creator: string;
  };

  useEffect(() => {
    if (inviteId) {
      getGuestData(inviteId).then((data) =>
        setPartyDetails(data as PartyDetails)
      );
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
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    setDragStart(clientY);
  };

  const handleDrag = (e: TouchEvent | MouseEvent) => {
    if (!isDragging) return;
    const clientY =
      'touches' in e
        ? (e as TouchEvent).touches[0].clientY
        : (e as MouseEvent).clientY;
    const delta = clientY - dragStart;
    if (delta > 0) {
      setDragOffset(delta);
    }
  };

  const handleDragEnd = () => {
    if (dragOffset > 150) {
      handleClose();
    } else {
      setDragOffset(0);
    }
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      const onMouseMove = (e: MouseEvent) => handleDrag(e);
      const onTouchMove = (e: TouchEvent) => handleDrag(e);
      const onMouseUp = () => handleDragEnd();
      const onTouchEnd = () => handleDragEnd();

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("touchend", onTouchEnd);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
      };
    }
  }, [isDragging, dragStart]);

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
          transition: isDragging ? 'none' : 'transform 0.3s ease',
          touchAction: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <Flex
          fillWidth
          horizontal="center"
          padding="12"
          cursor="grab"
          className={styles.dragHandle}
        >
          <Flex width="32" height="4" radius="full" background="neutral-alpha-medium" />
        </Flex>

        <Flex fillWidth horizontal="space-between" vertical="center" paddingX="24" paddingBottom="16">
          <Text variant="heading-default-xs">
            {partyDetails ? `${partyDetails.creator} invites you to -` : 'Invite Details'}
          </Text>
          <IconButton
            icon="close"
            variant="tertiary"
            onClick={handleClose}
            tooltip="Close"
          />
        </Flex>

        <Text variant="heading-strong-xl" padding="24">{partyDetails?.title}</Text>

        <Flex direction="row" gap="16" padding="24" paddingTop="0" overflowY="auto" mobileDirection="column">
          {partyDetails?.thumbnail && (
            <Flex direction="column" style={{ maxWidth: '400px' }}>
              <img
                src={partyDetails.thumbnail}
                alt="Thumbnail"
                style={{
                  width: '100%',
                  height: '240px',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
            </Flex>
          )}

          {partyDetails && (
            <>
              <Text color="text-subdued" paddingY="2">
                "{partyDetails.description.length > 70
                  ? partyDetails.description.substring(0, 70) + '...'
                  : partyDetails.description}"
              </Text>

              <Flex direction="column" gap="8" paddingTop="16" paddingBottom="64">
                <Flex
                  padding="12"
                  background="surface"
                  border="neutral-medium"
                  radius="s-4"
                  direction="row"
                  align="center"
                  horizontal="space-between"
                >
                  <Text>{partyDetails?.date}</Text>
                  <Icon name="calendar" size="s" color="text-subdued" />
                </Flex>

                <Flex
                  padding="12"
                  background="surface"
                  border="neutral-medium"
                  radius="s-4"
                  direction="row"
                  align="center"
                  horizontal="space-between"
                >
                  <Text>{partyDetails?.headcount}</Text>
                  <Icon name="person" size="s" color="text-subdued" />
                </Flex>

                <Flex
                  padding="12"
                  background="surface"
                  border="neutral-medium"
                  radius="s-4"
                  direction="row"
                  horizontal="space-between"
                >
                  <Text>
                    {partyDetails?.location.length > 100
                      ? partyDetails.location.substring(0, 100) + '...'
                      : partyDetails.location}
                  </Text>
                  <Icon name="location" size="s" color="text-subdued" />
                </Flex>

                <StoreBadge title="">
                  <Row paddingY="0">JOIN</Row>
                </StoreBadge>
              </Flex>
            </>
          )}
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
