"use client";

import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import { DashboardHeaderActions, DashboardSidebar } from "@/features/Dashboard/DashboardControls";
import { useAuth } from "@/context/AuthContext";
import { getTutorProfile, type TutorProfile } from "@/services/profileService";
import "./dashboard.css";

type Range = "7D" | "30D" | "90D" | "1Y";
type BookingTab = "Pending" | "Upcoming" | "Past";

const stats = [
  ["Profile Views", 0, "No data yet", "views"],
  ["Saves", 0, "No data yet", "saves"],
  ["Pending Requests", 0, "No pending requests", "requests"],
  ["Unread Messages", 0, "No unread messages", "messages"],
] as const;

const bookings: Record<BookingTab, { name: string; subject: string; time: string; avatar: string }[]> = { Pending: [], Upcoming: [], Past: [] };

const activity: readonly [string, string, string, string][] = [];
const messages: readonly [string, string, string, string, string][] = [];

function CountUp({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - started) / 900, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{count.toLocaleString()}</>;
}

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = { grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z", user: "M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", calendar: "M5 4v3M19 4v3M4 9h16M5 6h14a1 1 0 0 1 1 1v13H4V7a1 1 0 0 1 1-1Z", message: "M20 11.5a7.5 7.5 0 0 1-8 7.5 8.6 8.6 0 0 1-3-.5L4 20l1.5-4A7.2 7.2 0 0 1 4.5 12 7.5 7.5 0 0 1 12 4.5a7.5 7.5 0 0 1 8 7Z", chart: "M4 19V5M4 19h16M8 16v-5M12 16V7M16 16v-9", star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z", heart: "M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8A4.5 4.5 0 0 1 12 6.5a4.5 4.5 0 0 1 8.8 2.3Z", check: "m5 12 4 4L19 6", settings: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19 12l2-1.2-2-3.5-2.2.8a7 7 0 0 0-1.5-.9L15 5h-6l-.3 2.2a7 7 0 0 0-1.5.9L5 7.3l-2 3.5L5 12l-.1 1.5-1.9 1.2 2 3.5 2.2-.8c.5.4 1 .7 1.5.9L9 20h6l.3-1.7c.5-.2 1-.5 1.5-.9l2.2.8 2-3.5-2-1.2.1-1.5Z" };
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[name] ?? paths.grid} /></svg>;
}

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  useEffect(() => { if (user) void getTutorProfile(user.uid).then(setTutor).catch(() => setTutor(null)); }, [user]);
  const [range, setRange] = useState<Range>("30D");
  const [bookingTab, setBookingTab] = useState<BookingTab>("Pending");
  const [handled, setHandled] = useState<string[]>([]);
  const linePoints: Record<Range, string> = { "7D": "0,90 16,70 32,78 48,45 64,58 80,28 100,38", "30D": "0,92 12,80 24,84 36,58 48,66 60,42 72,50 84,22 100,31", "90D": "0,95 12,88 24,90 36,72 48,77 60,54 72,64 84,33 100,40", "1Y": "0,98 12,90 24,92 36,75 48,80 60,60 72,66 84,38 100,45" };
  const markBooking = (name: string) => setHandled((current) => [...current, name]);

  return <div className="dashboard-page">
    <DashboardSidebar />
    <main className="dashboard-main">
      <header className="dashboard-header dashboard-reveal"><div><p className="dashboard-kicker">TUTOR WORKSPACE</p><h1>Good morning, {tutor?.name?.split(" ")[0] ?? profile?.name?.split(" ")[0] ?? "there"} <span>✦</span></h1><p>Here’s what’s happening with your tutoring profile.</p></div><DashboardHeaderActions /></header>
      <section className="dashboard-stats" aria-label="Profile overview">{stats.map(([label, value, change, icon], index) => <article className="dashboard-card dashboard-stat dashboard-reveal" style={{ "--delay": `${index * 70}ms` } as React.CSSProperties} key={label}><div className={`dashboard-stat__icon dashboard-stat__icon--${icon}`}><Icon name={icon === "views" ? "chart" : icon === "saves" ? "heart" : icon === "requests" ? "calendar" : "message"} /></div><p>{label}</p><strong><CountUp value={value} /></strong><span className={icon === "requests" || icon === "messages" ? "dashboard-stat__note" : "dashboard-stat__change"}>{change}</span></article>)}</section>
      <section className="dashboard-grid dashboard-reveal" style={{ "--delay": "280ms" } as React.CSSProperties}>
        <article className="dashboard-card dashboard-chart-card"><div className="dashboard-card-heading"><div><h2>Profile Views</h2><p>Track how students discover you</p></div><div className="dashboard-range" role="group" aria-label="Profile views range">{(["7D", "30D", "90D", "1Y"] as Range[]).map((item) => <button className={range === item ? "is-active" : ""} onClick={() => setRange(item)} key={item}>{item}</button>)}</div></div><div className="dashboard-line-chart"><div className="dashboard-chart-y"><span>1,500</span><span>1,000</span><span>500</span><span>0</span></div><svg viewBox="0 0 100 110" preserveAspectRatio="none" role="img" aria-label={`Profile views over the last ${range}`}><defs><linearGradient id="views-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#6366F1" stopOpacity=".2" /><stop offset="1" stopColor="#6366F1" stopOpacity="0" /></linearGradient></defs><path className="dashboard-area-path" d={`M ${linePoints[range]} L 100,110 L 0,110 Z`} fill="url(#views-fill)" /><polyline className="dashboard-line-path" points={linePoints[range]} fill="none" /></svg><div className="dashboard-chart-x"><span>Aug 1</span><span>Aug 8</span><span>Aug 15</span><span>Aug 22</span><span>Today</span></div></div></article>
        <article className="dashboard-card dashboard-completeness"><div className="dashboard-card-heading"><div><h2>Profile Completeness</h2><p>A complete profile gets more bookings.</p></div><span className="dashboard-card-more">•••</span></div><div className="dashboard-completeness__body"><div className="dashboard-progress"><svg viewBox="0 0 120 120" width="120" height="120" role="img" aria-label={`Profile is ${tutor?.profileCompleteness ?? 0} percent complete`}><circle className="dashboard-progress__track" cx="60" cy="60" r="50" /><circle className="dashboard-progress__value" style={{ strokeDashoffset: 314 - (314 * (tutor?.profileCompleteness ?? 0)) / 100 }} cx="60" cy="60" r="50" /></svg><strong><CountUp value={tutor?.profileCompleteness ?? 0} />%</strong></div><div><strong>{(tutor?.profileCompleteness ?? 0) >= 100 ? "Your profile is ready!" : "Keep building your profile"}</strong><p>Complete your profile details so learners can find you.</p><Link href="/dashboard/profile" className="dashboard-text-link">Complete Profile <span>→</span></Link></div></div></article>
      </section>
      <section className="dashboard-grid dashboard-grid--lower dashboard-reveal" style={{ "--delay": "360ms" } as React.CSSProperties}>
        <article className="dashboard-card dashboard-bookings"><div className="dashboard-card-heading"><div><h2>Bookings Overview</h2><p>Stay on top of your sessions</p></div><Link href="/dashboard/bookings" className="dashboard-text-link">View all <span>→</span></Link></div><div className="dashboard-tabs" role="tablist">{(["Pending", "Upcoming", "Past"] as BookingTab[]).map((tab) => <button role="tab" aria-selected={bookingTab === tab} className={bookingTab === tab ? "is-active" : ""} onClick={() => setBookingTab(tab)} key={tab}>{tab}{tab === "Pending" && <small>2</small>}</button>)}</div><div className="dashboard-booking-list">{bookings[bookingTab].map((booking) => <div className={`dashboard-booking-row ${handled.includes(booking.name) ? "is-handled" : ""}`} key={booking.name}><span className="dashboard-person-avatar">{booking.avatar}</span><div><strong>{booking.name}</strong><p>{booking.subject} · {booking.time}</p></div>{bookingTab === "Pending" && !handled.includes(booking.name) ? <div className="dashboard-booking-actions"><button onClick={() => markBooking(booking.name)} className="dashboard-action-accept">Accept</button><button onClick={() => markBooking(booking.name)} className="dashboard-action-decline" aria-label={`Decline ${booking.name}`}>×</button></div> : <span className="dashboard-booking-status">{handled.includes(booking.name) ? "Handled" : "Confirmed"}</span>}</div>)}</div></article>
        <article className="dashboard-card dashboard-subjects"><div className="dashboard-card-heading"><div><h2>Top Subjects by Demand</h2><p>What students are looking for</p></div><span className="dashboard-card-more">•••</span></div><div className="dashboard-donut-wrap"><div className="dashboard-donut" role="img" aria-label="Subject demand: Mathematics 45 percent, Algebra 20 percent, Calculus 15 percent, Physics 10 percent, Others 10 percent"><div><strong>45%</strong><span>Math</span></div></div><div className="dashboard-legend"><span><i className="legend-math" />Mathematics <b>45%</b></span><span><i className="legend-algebra" />Algebra <b>20%</b></span><span><i className="legend-calculus" />Calculus <b>15%</b></span><span><i className="legend-physics" />Physics <b>10%</b></span><span><i className="legend-other" />Others <b>10%</b></span></div></div></article>
      </section>
      <section className="dashboard-grid dashboard-grid--bottom dashboard-reveal" style={{ "--delay": "440ms" } as React.CSSProperties}><article className="dashboard-card dashboard-activity" id="activity"><div className="dashboard-card-heading"><div><h2>Recent Activity</h2><p>Latest updates from your profile</p></div><Link href="/dashboard#activity" className="dashboard-text-link">View all <span>→</span></Link></div>{activity.map(([title, copy, time, icon]) => <div className="dashboard-activity-row" key={title}><span className={`dashboard-activity-icon dashboard-activity-icon--${icon}`}><Icon name={icon} /></span><div><strong>{title}</strong><p>{copy}</p></div><time>{time}</time></div>)}</article><article className="dashboard-card dashboard-messages"><div className="dashboard-card-heading"><div><h2>Messages <span className="dashboard-heading-count">5</span></h2><p>Stay connected with your students</p></div><Link href="/messages" className="dashboard-text-link">View all <span>→</span></Link></div>{[["SP", "Sofia Patel", "Thanks for the helpful session!", "10:42 AM", "pink"], ["MC", "Maya Chen", "Could we move our lesson to 5pm?", "Yesterday", "teal"], ["OG", "Oliver Grant", "Looking forward to our next class.", "Aug 25", "gold"]].map(([avatar, name, message, time, tone]) => <div className="dashboard-message-row" key={name}><span className={`dashboard-person-avatar dashboard-person-avatar--${tone}`}>{avatar}</span><div><strong>{name}</strong><p>{message}</p></div><time>{time}<i /></time></div>)}</article></section>
    </main>
  </div>;
}
