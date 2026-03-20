import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface BookSessionDialogProps {
  open: boolean;
  onClose: () => void;
  mentor: {
    id: string;
    name: string;
    skill: string;
    price: number;
    initials: string;
  };
}


const BookSessionDialog = ({ open, onClose, mentor }: BookSessionDialogProps) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleBook = async () => {
    if (!user || !profile) {
      navigate("/auth");
      return;
    }
    if (!selectedDate || !selectedTime) return;

    setLoading(true);
    const startTime = new Date(`${selectedDate}T${selectedTime}:00`);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    const { error } = await supabase.from("bookings").insert({
      student_id: profile.id,
      mentor_id: mentor.id,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      hourly_rate: mentor.price,
      notes: notes || null,
    });

    setLoading(false);
    if (!error) setBooked(true);
  };

  const handleClose = () => {
    setBooked(false);
    setSelectedDate("");
    setSelectedTime("");
    setNotes("");
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="gradient-card rounded-2xl border border-border/50 shadow-card w-full max-w-md overflow-hidden"
        >
          {booked ? (
            <div className="p-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">Session Booked!</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Your session with <span className="text-primary">{mentor.name}</span> is confirmed for{" "}
                {new Date(selectedDate).toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })} at {selectedTime}.
              </p>
              <button onClick={handleClose} className="px-6 py-2.5 rounded-lg gradient-accent font-semibold text-accent-foreground text-sm">
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-5 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm">
                    {mentor.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{mentor.name}</h3>
                    <p className="text-xs text-muted-foreground">{mentor.skill} · ₹{mentor.price}/hr</p>
                  </div>
                </div>
                <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Calendar className="w-4 h-4 text-primary" /> Select Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-border focus:border-primary/50 outline-none text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Clock className="w-4 h-4 text-primary" /> Select Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedTime === t
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Notes (optional)</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What do you want to learn?"
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-border focus:border-primary/50 outline-none text-sm transition-colors resize-none"
                  />
                </div>

                <motion.button
                  onClick={handleBook}
                  disabled={!selectedDate || !selectedTime || loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-lg gradient-accent font-bold text-accent-foreground shadow-glow disabled:opacity-50 text-sm"
                >
                  {loading ? "Booking..." : !user ? "Sign in to Book" : `Book for ₹${mentor.price}`}
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookSessionDialog;
