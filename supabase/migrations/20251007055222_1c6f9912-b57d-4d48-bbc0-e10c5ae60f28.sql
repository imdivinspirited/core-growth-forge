-- Real-time Chat System Tables
CREATE TABLE public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'direct', -- 'direct', 'group', 'support'
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE public.chat_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_read_at TIMESTAMPTZ,
  UNIQUE(room_id, user_id)
);

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- 'text', 'image', 'file', 'location'
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

-- Tourism Feed Tables
CREATE TABLE public.tourism_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  location_name TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  country TEXT,
  city TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'general',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.tourism_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.tourism_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.tourism_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.tourism_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Vendor and KYC Tables
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  verification_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  rating DECIMAL(2,1) DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'business_license', 'tax_id', 'identity_proof', 'address_proof'
  document_url TEXT NOT NULL,
  verification_status TEXT DEFAULT 'pending',
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bookings and Payments
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  service_details JSONB NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  booking_status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT NOT NULL, -- 'razorpay', 'paytm', 'upi'
  payment_gateway_id TEXT,
  transaction_id TEXT,
  status TEXT DEFAULT 'pending',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'booking', 'payment', 'chat', 'system', 'promotion'
  channel TEXT NOT NULL, -- 'push', 'email', 'sms', 'in-app'
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'read'
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);

-- Fraud Detection
CREATE TABLE public.fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  alert_type TEXT NOT NULL, -- 'suspicious_login', 'unusual_transaction', 'multiple_failed_payments'
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'false_positive'
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI Recommendations
CREATE TABLE public.ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL, -- 'destination', 'activity', 'vendor', 'itinerary'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence_score DECIMAL(3, 2),
  metadata JSONB DEFAULT '{}'::jsonb,
  feedback TEXT, -- 'helpful', 'not_helpful', 'booked'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tourism_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tourism_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tourism_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Chat
CREATE POLICY "Users can view rooms they participate in"
  ON public.chat_rooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_participants
      WHERE room_id = chat_rooms.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chat rooms"
  ON public.chat_rooms FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view their participations"
  ON public.chat_participants FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can join rooms"
  ON public.chat_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view messages in their rooms"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_participants
      WHERE room_id = chat_messages.room_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their rooms"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.chat_participants
      WHERE room_id = chat_messages.room_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for Tourism
CREATE POLICY "Published tourism posts viewable by all"
  ON public.tourism_posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Users can create tourism posts"
  ON public.tourism_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their posts"
  ON public.tourism_posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all tourism posts"
  ON public.tourism_posts FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view comments"
  ON public.tourism_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can comment"
  ON public.tourism_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can like posts"
  ON public.tourism_likes FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for Vendors
CREATE POLICY "Verified vendors viewable by all"
  ON public.vendors FOR SELECT
  USING (verification_status = 'verified');

CREATE POLICY "Users can create vendor profiles"
  ON public.vendors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Vendors can update their profiles"
  ON public.vendors FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins manage all vendors"
  ON public.vendors FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Vendors view their KYC documents"
  ON public.kyc_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors
      WHERE vendors.id = kyc_documents.vendor_id AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can upload KYC documents"
  ON public.kyc_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.vendors
      WHERE vendors.id = kyc_documents.vendor_id AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage KYC documents"
  ON public.kyc_documents FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for Bookings
CREATE POLICY "Users view their bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Vendors view their bookings"
  ON public.bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors
      WHERE vendors.id = bookings.vendor_id AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Users create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage all bookings"
  ON public.bookings FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for Payments
CREATE POLICY "Users view their payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins manage all payments"
  ON public.payments FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for Notifications
CREATE POLICY "Users view their notifications"
  ON public.notifications FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for Fraud Alerts
CREATE POLICY "Admins manage fraud alerts"
  ON public.fraud_alerts FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for AI Recommendations
CREATE POLICY "Users view their recommendations"
  ON public.ai_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can provide feedback"
  ON public.ai_recommendations FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_chat_messages_room_id ON public.chat_messages(room_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX idx_tourism_posts_location ON public.tourism_posts(latitude, longitude);
CREATE INDEX idx_tourism_posts_created_at ON public.tourism_posts(created_at DESC);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_vendor_id ON public.bookings(vendor_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id, created_at DESC);

-- Triggers for updated_at
CREATE TRIGGER update_chat_rooms_updated_at
  BEFORE UPDATE ON public.chat_rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tourism_posts_updated_at
  BEFORE UPDATE ON public.tourism_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tourism_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;