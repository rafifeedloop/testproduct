"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";
import Link from "next/link";

interface ScheduleEvent {
  id: string;
  name: string;
  time: string;
  date: string;
  status: "scheduled" | "running" | "completed" | "failed";
  devices: string[];
}

const mockEvents: ScheduleEvent[] = [
  {
    id: "1",
    name: "Daily Regression Suite",
    time: "09:00",
    date: "2024-01-15",
    status: "scheduled",
    devices: ["iPhone 14 Pro", "Samsung Galaxy S23"],
  },
  {
    id: "2",
    name: "Smoke Tests",
    time: "10:00",
    date: "2024-01-15",
    status: "scheduled",
    devices: ["All iOS Devices"],
  },
  {
    id: "3",
    name: "Smoke Tests",
    time: "11:00",
    date: "2024-01-15",
    status: "scheduled",
    devices: ["All iOS Devices"],
  },
  {
    id: "4",
    name: "Smoke Tests",
    time: "12:00",
    date: "2024-01-15",
    status: "running",
    devices: ["All iOS Devices"],
  },
  {
    id: "5",
    name: "Performance Check",
    time: "14:00",
    date: "2024-01-16",
    status: "scheduled",
    devices: ["Pixel 7 Pro"],
  },
  {
    id: "6",
    name: "Nightly Build",
    time: "02:00",
    date: "2024-01-17",
    status: "scheduled",
    devices: ["iPhone 13", "Galaxy S22"],
  },
  {
    id: "7",
    name: "Daily Regression Suite",
    time: "09:00",
    date: "2024-01-22",
    status: "scheduled",
    devices: ["iPhone 14 Pro", "Samsung Galaxy S23"],
  },
];

export function ScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 15));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `2024-01-${day.toString().padStart(2, '0')}`;
    return mockEvents.filter(event => event.date === dateStr);
  };

  const getStatusColor = (status: ScheduleEvent["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-[var(--brand-primary-500)]";
      case "running":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "failed":
        return "bg-[var(--brand-danger)]";
      default:
        return "bg-zinc-400";
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const events = getEventsForDate(day);
      const isToday = day === 15 && currentDate.getMonth() === 0;
      const isSelected = selectedDate?.getDate() === day && 
                        selectedDate?.getMonth() === currentDate.getMonth();

      days.push(
        <div
          key={day}
          className={`h-32 border border-[var(--border-subtle)] rounded-[var(--r-ctl)] p-2 cursor-pointer transition-all hover:shadow-[var(--e-1)] ${
            isToday ? "bg-blue-50 border-[var(--brand-primary-500)]" : "bg-[var(--surface)]"
          } ${isSelected ? "ring-2 ring-[var(--brand-primary-500)]" : ""}`}
          onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-medium ${
              isToday ? "text-[var(--brand-primary-500)]" : "text-[var(--brand-ink)]"
            }`}>
              {day}
            </span>
            {events.length > 0 && (
              <span className="text-xs text-[var(--text-muted)] bg-zinc-100 px-1.5 py-0.5 rounded-full">
                {events.length}
              </span>
            )}
          </div>
          <div className="space-y-1 overflow-y-auto max-h-20">
            {events.slice(0, 3).map((event, idx) => (
              <div
                key={idx}
                className="flex items-start gap-1 group"
              >
                <div className={`h-1.5 w-1.5 rounded-full mt-1 ${getStatusColor(event.status)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-700 truncate group-hover:text-[var(--brand-primary-500)]">
                    {event.time} - {event.name}
                  </p>
                </div>
              </div>
            ))}
            {events.length > 3 && (
              <p className="text-xs text-[var(--text-muted)]">
                +{events.length - 3} more
              </p>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const selectedDateEvents = selectedDate 
    ? mockEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === selectedDate.getDate() &&
               eventDate.getMonth() === selectedDate.getMonth();
      })
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-[var(--brand-ink)]">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={previousMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(2024, 0, 15))}
                className="h-8 px-3"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {renderCalendarDays()}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[var(--brand-ink)]">
              {selectedDate 
                ? `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}`
                : "Select a date"
              }
            </h3>
            {selectedDate && (
              <Link href="/schedule/new">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>

          {selectedDate ? (
            <div className="space-y-3">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/schedule/${event.id}`}
                    className="block p-3 rounded-[var(--r-ctl)] border border-[var(--border-subtle)] hover:shadow-[var(--e-1)] transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-[var(--brand-ink)]">
                        {event.name}
                      </h4>
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(event.status)}`} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <Clock className="h-3 w-3" />
                      <span>{event.time}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {event.devices.slice(0, 2).map((device, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-full text-xs"
                        >
                          {device}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-zinc-200 mx-auto mb-3" />
                  <p className="text-sm text-[var(--text-muted)]">
                    No scheduled runs
                  </p>
                  <Link href="/schedule/new">
                    <Button
                      size="sm"
                      className="mt-3 h-8 px-3 bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] text-white"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Schedule
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-[var(--text-muted)]">
                Select a date to view scheduled runs
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
          <h3 className="text-base font-semibold text-[var(--brand-ink)] mb-3">
            Legend
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[var(--brand-primary-500)]" />
              <span className="text-xs text-zinc-600">Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-xs text-zinc-600">Running</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-xs text-zinc-600">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[var(--brand-danger)]" />
              <span className="text-xs text-zinc-600">Failed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}