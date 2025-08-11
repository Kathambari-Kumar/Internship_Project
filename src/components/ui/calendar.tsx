
"use client";

import FullCalendar from '@fullcalendar/react'
import { formatDate, DateSelectArg, EventClickArg, EventApi } from "@fullcalendar/core";
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid';
import React, {useState, useEffect} from "react";
import interactionPlugin from '@fullcalendar/interaction';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Input } from './input';
import { Button } from './button';

const Calendar = () => {
    const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [newEventTitle, setNewEventTitle] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<DateSelectArg | null> (null);

    useEffect( () => {
        if (typeof window !== "undefined") {
            const savedEvents = localStorage.getItem("events");
            if(savedEvents) {setCurrentEvents(JSON.parse(savedEvents));}
        }
    }, []);
    useEffect (() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("events", JSON.stringify(currentEvents));
        }
    }, [currentEvents])

    const handleDateClick = (selected : DateSelectArg) => {
        setSelectedDate(selected);
        setIsDialogOpen(true);
    };
    const handleEventClick = (selected : EventClickArg) => {
        
         if (window.confirm('Are you sure to delete the evnent "${selected.event.title}"?')) {
            selected.event.remove();
         }
    };

    const handleAddEvent = (e : React.FormEvent) => {
            e.preventDefault();
            if(newEventTitle && selectedDate) {
                const calendarApi = selectedDate.view.calendar;
                calendarApi.unselect();

                const newEvent = {
                    id : '${selectedDate?.start.toISOString()}-${newEventTitle}',
                    title : newEventTitle,
                    start : selectedDate?.start,
                    end : selectedDate?.end,
                    allDay : selectedDate?.allDay,
                };
                calendarApi.addEvent(newEvent);
                handleCloseDialog();
            }}

            const handleCloseDialog = () => {
                    setIsDialogOpen(false);
                    setNewEventTitle("");
            };

        return( 
            <>
            <div className='flex w-full px-10 justify-start gap-8'>
                <div className='w-3/12'>
                    <div className='py-10 text-sm font-light px-2'>          
                    <ul className='space-y-1'>
                        {currentEvents.length <= 0 && (
                        <div className='text-center text-sm'>No Events</div>)}
                        {currentEvents.length > 0 && 
                            currentEvents.map((event:EventApi) => (
                            <li className='border border-r-gray-200 shadow rounded.md text-red-700' key={event.id}>
                                {event.title}<br/>
                                <label className='text-slate-800'>
                                    {formatDate(event.start!, {
                                        year:"numeric",
                                        month: "short",
                                        day:"2-digit",
                                    })}
                                </label>
                            </li>))}
                    </ul>
                   </div>
                </div>
                <div className='w-9/12 mt8'>
                    
                    <FullCalendar 
                    height = {"85vh"}
                    plugins = {[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar = {{
                        left : "prevm next, today", 
                        center:"title", 
                        right : "dayGridMonth, timeGridWeek, timeGridDay"}}
                    initialView='dayGridMonth'
                    editable = {true}
                    selectable = {true}
                    selectMirror = {true}
                    dayMaxEvents={true}
                    select={handleDateClick}
                    eventClick = {handleEventClick}
                    eventsSet={(events) => setCurrentEvents(events)}
                    initialEvents={typeof window !== "undefined" ? JSON.parse(localStorage.getItem("events") || "[]") : []}
                    />
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Event</DialogTitle>
                    </DialogHeader>
                    <form className='space-x-5 mb-4' onSubmit={handleAddEvent}>
                        <Input type="text" 
                        placeholder='event Title'
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        required 
                        className="border border-gray-200 p-3 rounded-md text-lg"></Input>
                        <Button className='bg-primary text-white p-3 mt-5 rounded-md'>
                            Add
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
            </>
        );
}

export default Calendar;