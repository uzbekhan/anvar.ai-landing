import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Check, Loader2, CreditCard, Shield, Wifi, Plane, Building, ShoppingBag, Wallet, Smartphone, Landmark, TrendingUp, User, FileText, Camera, MapPin } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type PaymentMethod = "visa" | "mastercard" | "crypto";
type CryptoCurrency = "USDT" | "ETH" | "BTC" | "USDC";

type MsgStep =
  | { type: "user"; text: string }
  | { type: "agent"; text: string }
  | { type: "card"; card: "search" | "checkout" | "qr" | "boarding" | "hotel-confirm" | "order-confirm" | "wallet-confirm" | "plan-confirm" | "bank-confirm" | "stock-confirm" | "kyc" | "id-upload" }
  | { type: "system"; text: string };

interface CryptoInfo {
  currency: CryptoCurrency;
  walletAddress: string;
  network: string;
  txHash: string;
}

interface BoardingInfo {
  from: string;
  fromCity: string;
  to: string;
  toCity: string;
  flight: string;
  airline: string;
  dep: string;
  arr: string;
  seat: string;
  gate: string;
  boarding: string;
  passenger: string;
  class: string;
  date: string;
}

interface ScenarioVariant {
  messages: MsgStep[];
  searchItems: { name: string; price: string; match: number }[];
  checkout: { item: string; price: string; payment: PaymentMethod; crypto?: CryptoInfo };
  fulfillment: Record<string, string>;
  boardingInfo?: BoardingInfo;
  qrValue?: string;
  qrLabel?: string;
}

interface TabConfig {
  id: string;
  label: string;
  icon: typeof Wifi;
  variants: ScenarioVariant[];
}

// ─── eSIM Variants ──────────────────────────────────────
const esimVariants: ScenarioVariant[] = [
  {
    messages: [
      { type: "user", text: "Activate a SIMALLO eSIM for Japan, 10GB for 7 days" },
      { type: "agent", text: "Connecting to SIMALLO — fetching Japan 10GB plan..." },
      { type: "agent", text: "SIMALLO Japan 10GB, 7-day plan — ¥2,980. Ready to activate." },
      { type: "user", text: "Go ahead" },
      { type: "agent", text: "How would you like to pay? Card or crypto?" },
      { type: "user", text: "Card" },
      { type: "agent", text: "Processing payment with Visa •••• 4242..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Payment confirmed. Your SIMALLO eSIM is ready!" },
      { type: "card", card: "qr" },
      { type: "system", text: "✓ Service fulfilled — SIMALLO eSIM for Japan" },
    ],
    searchItems: [
      { name: "SIMALLO — Japan 10GB / 7 days", price: "¥2,980", match: 96 },
    ],
    checkout: { item: "SIMALLO — Japan 10GB / 7 days", price: "¥2,980", payment: "visa" },
    fulfillment: {},
    qrValue: "https://anvar.ai/esim/activate/SIMALLO-JP-10GB-7D",
    qrLabel: "SIMALLO-JP-10GB-7D",
  },
  {
    messages: [
      { type: "user", text: "Get me a TrueMove H unlimited eSIM for Thailand, 14 days" },
      { type: "agent", text: "Connecting to TrueMove H — fetching Thailand unlimited plan..." },
      { type: "agent", text: "TrueMove H Unlimited 4G/5G, 14 days — ฿899. Excellent coverage across Thailand." },
      { type: "user", text: "Pay with USDT" },
      { type: "agent", text: "Processing USDT payment on Polygon..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Transaction confirmed on-chain. TrueMove H eSIM activated!" },
      { type: "card", card: "qr" },
      { type: "system", text: "✓ Service fulfilled — TrueMove H eSIM for Thailand" },
    ],
    searchItems: [
      { name: "TrueMove H — Unlimited 14 days", price: "฿899", match: 95 },
    ],
    checkout: { item: "TrueMove H — Thailand Unlimited / 14 days", price: "฿899", payment: "crypto", crypto: { currency: "USDT", walletAddress: "0x7a3B...9f2E", network: "Polygon", txHash: "0xab3f...c91d" } },
    fulfillment: {},
    qrValue: "https://anvar.ai/esim/activate/TMH-TH-UNL-14D",
    qrLabel: "TMH-TH-UNL-14D",
  },
  {
    messages: [
      { type: "user", text: "I want a HalloCall eSIM for Turkey, 20GB for 15 days" },
      { type: "agent", text: "Connecting to HalloCall — fetching Turkey 20GB plan..." },
      { type: "agent", text: "HalloCall Turkey 20GB, 15 days — $12.99. Best coverage in Istanbul and coastal areas." },
      { type: "user", text: "Activate it" },
      { type: "agent", text: "How would you like to pay? Card or crypto?" },
      { type: "user", text: "Card" },
      { type: "agent", text: "Charging Visa •••• 4242..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "HalloCall eSIM ready! Scan to install." },
      { type: "card", card: "qr" },
      { type: "system", text: "✓ Service fulfilled — HalloCall eSIM for Turkey" },
    ],
    searchItems: [
      { name: "HalloCall — Turkey 20GB / 15 days", price: "$12.99", match: 97 },
    ],
    checkout: { item: "HalloCall — Turkey 20GB / 15 days", price: "$12.99", payment: "visa" },
    fulfillment: {},
    qrValue: "https://anvar.ai/esim/activate/HCALL-TR-20GB-15D",
    qrLabel: "HCALL-TR-20GB-15D",
  },
  {
    messages: [
      { type: "user", text: "Activate a Claro eSIM for Brazil, 8GB with WhatsApp" },
      { type: "agent", text: "Connecting to Claro Brazil — fetching 8GB + WhatsApp plan..." },
      { type: "agent", text: "Claro 8GB + unlimited WhatsApp, 5 days — R$39.90. Covers São Paulo and Rio." },
      { type: "user", text: "Buy it with USDC" },
      { type: "agent", text: "Initiating USDC payment..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Blockchain confirmed. Your Claro eSIM is ready." },
      { type: "card", card: "qr" },
      { type: "system", text: "✓ Service fulfilled — Claro eSIM for Brazil" },
    ],
    searchItems: [
      { name: "Claro — 8GB + WhatsApp / 5 days", price: "R$39.90", match: 93 },
    ],
    checkout: { item: "Claro — Brazil 8GB / 5 days", price: "R$39.90", payment: "crypto", crypto: { currency: "USDC", walletAddress: "0x4dC1...b83A", network: "Ethereum", txHash: "0xef71...2a0b" } },
    fulfillment: {},
    qrValue: "https://anvar.ai/esim/activate/CLARO-BR-8GB-5D",
    qrLabel: "CLARO-BR-8GB-5D",
  },
  {
    messages: [
      { type: "user", text: "Get me a KT Telecom eSIM for South Korea, 15GB for 10 days" },
      { type: "agent", text: "Connecting to KT Telecom — fetching Korea 15GB plan..." },
      { type: "agent", text: "KT Telecom 15GB + unlimited calls, 10 days — ₩18,900. Full 5G in Seoul." },
      { type: "user", text: "Pay with ETH" },
      { type: "agent", text: "Processing ETH payment on Ethereum network..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "On-chain confirmation received. KT eSIM activated!" },
      { type: "card", card: "qr" },
      { type: "system", text: "✓ Service fulfilled — KT Telecom eSIM for South Korea" },
    ],
    searchItems: [
      { name: "KT Telecom — 15GB + Calls / 10 days", price: "₩18,900", match: 96 },
    ],
    checkout: { item: "KT Telecom — Korea 15GB / 10 days", price: "₩18,900", payment: "crypto", crypto: { currency: "ETH", walletAddress: "0x5cA9...d32F", network: "Ethereum", txHash: "0x72ae...b10c" } },
    fulfillment: {},
    qrValue: "https://anvar.ai/esim/activate/KT-KR-15GB-10D",
    qrLabel: "KT-KR-15GB-10D",
  },
  {
    messages: [
      { type: "user", text: "Compare eSIM providers for Europe, best deal for 30 days" },
      { type: "agent", text: "Comparing SIMALLO, HalloCall, eSIMvu, and Airalo for EU roaming plans..." },
      { type: "card", card: "search" },
      { type: "agent", text: "Best value: eSIMvu EU-Wide 20GB, 36 countries — €24.99" },
      { type: "user", text: "Go with eSIMvu" },
      { type: "agent", text: "How would you like to pay? Card or crypto?" },
      { type: "user", text: "Mastercard" },
      { type: "agent", text: "Charging Mastercard •••• 8891..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Done! Scan to install your eSIM." },
      { type: "card", card: "qr" },
      { type: "system", text: "✓ Service fulfilled — eSIMvu eSIM for 36 EU countries" },
    ],
    searchItems: [
      { name: "eSIMvu — EU 20GB / 36 countries", price: "€24.99", match: 97 },
      { name: "SIMALLO — EU 15GB", price: "€21.00", match: 82 },
      { name: "Airalo — EU 10GB", price: "€16.50", match: 78 },
      { name: "HalloCall — EU 12GB", price: "€18.99", match: 74 },
    ],
    checkout: { item: "eSIMvu — EU 20GB / 30 days", price: "€24.99", payment: "mastercard" },
    fulfillment: {},
    qrValue: "https://anvar.ai/esim/activate/ESIMVU-EU-20GB-30D",
    qrLabel: "ESIMVU-EU-20GB-30D",
  },
];

// ─── Flight Variants ────────────────────────────────────
const flightVariants: ScenarioVariant[] = [
  {
    messages: [
      { type: "user", text: "Book an Emirates flight from London to Dubai next Friday" },
      { type: "agent", text: "Connecting to Emirates — checking LHR → DXB availability on March 14..." },
      { type: "agent", text: "Emirates EK-002, direct, departure 09:15, arrival 19:30 — £428. Window seat 24A available." },
      { type: "user", text: "Book it" },
      { type: "agent", text: "How would you like to pay? Card or crypto?" },
      { type: "user", text: "Visa" },
      { type: "agent", text: "Reserving seat 24A, charging Visa •••• 4242..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Booking confirmed! Here's your Emirates boarding pass." },
      { type: "card", card: "boarding" },
      { type: "system", text: "✓ Flight booked — Emirates EK-002, Seat 24A" },
    ],
    searchItems: [
      { name: "Emirates EK-002 — Direct, 09:15", price: "£428", match: 94 },
    ],
    checkout: { item: "Emirates EK-002, Seat 24A", price: "£428", payment: "visa" },
    fulfillment: { from: "LHR", to: "DXB", flight: "EK-002", dep: "09:15", arr: "19:30", seat: "24A · Window" },
    boardingInfo: { from: "LHR", fromCity: "London Heathrow", to: "DXB", toCity: "Dubai Intl", flight: "EK-002", airline: "Emirates", dep: "09:15", arr: "19:30", seat: "24A", gate: "B42", boarding: "08:30", passenger: "S. RAHMAN", class: "Economy", date: "14 MAR" },
  },
  {
    messages: [
      { type: "user", text: "Book ANA business class from New York to Tokyo, March 20" },
      { type: "agent", text: "Connecting to ANA — checking JFK → NRT business class on March 20..." },
      { type: "agent", text: "ANA NH-009, lie-flat suite, dep 11:00, arr 14:30+1 — $4,890. Suite 2K available." },
      { type: "user", text: "Perfect, pay with ETH" },
      { type: "agent", text: "Processing crypto payment for ANA business class..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Confirmed! Your ANA boarding pass is ready." },
      { type: "card", card: "boarding" },
      { type: "system", text: "✓ Flight booked — ANA NH-009, Business Suite" },
    ],
    searchItems: [
      { name: "ANA NH-009 Business 11:00", price: "$4,890", match: 96 },
    ],
    checkout: { item: "ANA NH-009, Business Suite", price: "$4,890", payment: "crypto", crypto: { currency: "ETH", walletAddress: "0x8fA2...d41C", network: "Ethereum", txHash: "0x3c9e...7b2f" } },
    fulfillment: { from: "JFK", to: "NRT", flight: "NH-009", dep: "11:00", arr: "14:30+1", seat: "2K · Suite" },
    boardingInfo: { from: "JFK", fromCity: "New York JFK", to: "NRT", toCity: "Tokyo Narita", flight: "NH-009", airline: "ANA", dep: "11:00", arr: "14:30+1", seat: "2K", gate: "A17", boarding: "10:15", passenger: "L. CHEN", class: "Business", date: "20 MAR" },
  },
  {
    messages: [
      { type: "user", text: "Book a Ryanair flight from Berlin to Barcelona this Saturday" },
      { type: "agent", text: "Connecting to Ryanair — checking BER → BCN on March 15..." },
      { type: "agent", text: "Ryanair FR-8821, Saturday 06:30, arrive 09:15 — €37. Seat 14F available." },
      { type: "user", text: "Book it" },
      { type: "agent", text: "How would you like to pay? Card or crypto?" },
      { type: "user", text: "Mastercard" },
      { type: "agent", text: "Confirming Ryanair booking with Mastercard •••• 8891..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Booked! Here's your Ryanair pass." },
      { type: "card", card: "boarding" },
      { type: "system", text: "✓ Flight booked — Ryanair FR-8821, €37" },
    ],
    searchItems: [
      { name: "Ryanair FR-8821 06:30", price: "€37", match: 91 },
    ],
    checkout: { item: "Ryanair FR-8821, Seat 14F", price: "€37", payment: "mastercard" },
    fulfillment: { from: "BER", to: "BCN", flight: "FR-8821", dep: "06:30", arr: "09:15", seat: "14F · Window" },
    boardingInfo: { from: "BER", fromCity: "Berlin Brandenburg", to: "BCN", toCity: "Barcelona El Prat", flight: "FR-8821", airline: "Ryanair", dep: "06:30", arr: "09:15", seat: "14F", gate: "D08", boarding: "05:50", passenger: "M. WEBER", class: "Economy", date: "15 MAR" },
  },
  {
    messages: [
      { type: "user", text: "Turkish Airlines first class from Dubai to Istanbul, March 22" },
      { type: "agent", text: "Connecting to Turkish Airlines — checking DXB → IST first class on March 22..." },
      { type: "agent", text: "Turkish Airlines TK-760, First Suite, dep 14:20, arr 18:40 — $2,350. Suite 1A available." },
      { type: "user", text: "Pay with USDC" },
      { type: "agent", text: "Processing USDC payment on Ethereum..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Confirmed! Your Turkish Airlines first class boarding pass:" },
      { type: "card", card: "boarding" },
      { type: "system", text: "✓ Flight booked — TK-760, First Suite" },
    ],
    searchItems: [
      { name: "Turkish TK-760 First 14:20", price: "$2,350", match: 97 },
    ],
    checkout: { item: "TK-760, First Suite", price: "$2,350", payment: "crypto", crypto: { currency: "USDC", walletAddress: "0x6bE8...a29D", network: "Ethereum", txHash: "0xcc41...9f7a" } },
    fulfillment: { from: "DXB", to: "IST", flight: "TK-760", dep: "14:20", arr: "18:40", seat: "1A · Suite" },
    boardingInfo: { from: "DXB", fromCity: "Dubai Intl", to: "IST", toCity: "Istanbul Airport", flight: "TK-760", airline: "Turkish Airlines", dep: "14:20", arr: "18:40", seat: "1A", gate: "E11", boarding: "13:30", passenger: "O. YILMAZ", class: "First", date: "22 MAR" },
  },
  {
    messages: [
      { type: "user", text: "Compare flights from Singapore to Sydney, March 18, premium economy" },
      { type: "agent", text: "Comparing Singapore Airlines, Qantas, and Scoot for SIN → SYD on March 18..." },
      { type: "card", card: "search" },
      { type: "agent", text: "Best match: Singapore Airlines SQ-221, premium economy, dep 22:45, arr 09:15+1 — S$1,280" },
      { type: "user", text: "Book Singapore Airlines" },
      { type: "agent", text: "How would you like to pay? Card or crypto?" },
      { type: "user", text: "Use my Visa" },
      { type: "agent", text: "Securing seat 38C, charging Visa •••• 4242..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Booking confirmed! Boarding pass issued." },
      { type: "card", card: "boarding" },
      { type: "system", text: "✓ Flight booked — SQ-221, Premium Economy" },
    ],
    searchItems: [
      { name: "Singapore Air SQ-221 22:45", price: "S$1,280", match: 95 },
      { name: "Qantas QF-002 08:30", price: "S$1,450", match: 82 },
      { name: "Scoot TR-002 01:15", price: "S$680", match: 67 },
    ],
    checkout: { item: "SQ-221, Premium Economy 38C", price: "S$1,280", payment: "visa" },
    fulfillment: { from: "SIN", to: "SYD", flight: "SQ-221", dep: "22:45", arr: "09:15+1", seat: "38C · Premium" },
    boardingInfo: { from: "SIN", fromCity: "Singapore Changi", to: "SYD", toCity: "Sydney Kingsford", flight: "SQ-221", airline: "Singapore Airlines", dep: "22:45", arr: "09:15+1", seat: "38C", gate: "C22", boarding: "22:00", passenger: "R. TAN", class: "Premium Economy", date: "18 MAR" },
  },
];

// ─── Hotel Variants ─────────────────────────────────────
const hotelVariants: ScenarioVariant[] = [
  {
    messages: [
      { type: "user", text: "Book a room at the Cerulean Tower in Tokyo, March 15–18" },
      { type: "agent", text: "Connecting to Cerulean Tower Tokyo — checking availability Mar 15–18..." },
      { type: "agent", text: "Cerulean Tower Deluxe King, 4.8★, Shibuya — ¥32,400/night. Breakfast can be added for ¥2,500." },
      { type: "user", text: "Book it with breakfast" },
      { type: "agent", text: "How would you like to pay? Card or crypto?" },
      { type: "user", text: "Visa" },
      { type: "agent", text: "Charging Visa •••• 4242, securing reservation..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Reservation confirmed! Check-in March 15." },
      { type: "card", card: "hotel-confirm" },
      { type: "system", text: "✓ Hotel booked — Cerulean Tower, 3 nights" },
    ],
    searchItems: [
      { name: "Cerulean Tower — Deluxe King", price: "¥32,400/night", match: 95 },
    ],
    checkout: { item: "Cerulean Tower, 3 nights + breakfast", price: "¥107,800", payment: "visa" },
    fulfillment: { checkin: "Mar 15, 15:00", checkout: "Mar 18, 11:00", room: "Deluxe King + Breakfast", conf: "CT-38291" },
  },
  {
    messages: [
      { type: "user", text: "Reserve a room at Hôtel du Petit Moulin in Paris, March 20–22" },
      { type: "agent", text: "Connecting to Hôtel du Petit Moulin — checking Mar 20–22..." },
      { type: "agent", text: "Superior Double with garden view available, 4.9★ — €285/night." },
      { type: "user", text: "Reserve it, pay with Bitcoin" },
      { type: "agent", text: "Processing BTC payment for your Paris stay..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Reservation secured! Bienvenue à Paris." },
      { type: "card", card: "hotel-confirm" },
      { type: "system", text: "✓ Hotel booked — Hôtel du Petit Moulin, 2 nights" },
    ],
    searchItems: [
      { name: "Hôtel du Petit Moulin — Superior Double", price: "€285/night", match: 97 },
    ],
    checkout: { item: "Hôtel du Petit Moulin, 2 nights", price: "€570", payment: "crypto", crypto: { currency: "BTC", walletAddress: "bc1q...xp7m", network: "Bitcoin", txHash: "a1b2c3...f4e5" } },
    fulfillment: { checkin: "Mar 20, 14:00", checkout: "Mar 22, 11:00", room: "Superior Double · Garden View", conf: "PM-44812" },
  },
  {
    messages: [
      { type: "user", text: "Book a villa at Four Seasons Jimbaran Bali, April 1–6" },
      { type: "agent", text: "Connecting to Four Seasons Jimbaran — checking villa availability Apr 1–6..." },
      { type: "agent", text: "Ocean Villa with private pool, 4.9★ — $680/night. Couples spa package available for +$200." },
      { type: "user", text: "Book the villa with spa" },
      { type: "agent", text: "How would you like to pay? Card or crypto?" },
      { type: "user", text: "Mastercard" },
      { type: "agent", text: "Adding couples spa, charging Mastercard •••• 8891..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Paradise awaits! Reservation confirmed." },
      { type: "card", card: "hotel-confirm" },
      { type: "system", text: "✓ Resort booked — Four Seasons Bali, 5 nights" },
    ],
    searchItems: [
      { name: "Four Seasons Jimbaran — Ocean Villa", price: "$680/night", match: 98 },
    ],
    checkout: { item: "Four Seasons Villa + Spa, 5 nights", price: "$3,900", payment: "mastercard" },
    fulfillment: { checkin: "Apr 1, 14:00", checkout: "Apr 6, 12:00", room: "Ocean Villa + Couples Spa", conf: "FS-90122" },
  },
  {
    messages: [
      { type: "user", text: "Book a room at the Hilton Istanbul Bosphorus, March 25–29" },
      { type: "agent", text: "Connecting to Hilton Istanbul Bosphorus — checking Mar 25–29..." },
      { type: "agent", text: "Executive Room with Bosphorus view, 4.6★ — $180/night. Club lounge access included." },
      { type: "user", text: "Book it" },
      { type: "agent", text: "How would you like to pay? Card or crypto?" },
      { type: "user", text: "Card" },
      { type: "agent", text: "Reserving with Visa •••• 4242..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "All set! Enjoy Istanbul." },
      { type: "card", card: "hotel-confirm" },
      { type: "system", text: "✓ Hotel booked — Hilton Istanbul, 4 nights" },
    ],
    searchItems: [
      { name: "Hilton Istanbul — Executive Bosphorus", price: "$180/night", match: 94 },
    ],
    checkout: { item: "Hilton Istanbul, 4 nights", price: "$720", payment: "visa" },
    fulfillment: { checkin: "Mar 25, 15:00", checkout: "Mar 29, 12:00", room: "Executive · Bosphorus View", conf: "HI-77410" },
  },
  {
    messages: [
      { type: "user", text: "Compare ski chalets in Swiss Alps for New Year, 3 nights" },
      { type: "agent", text: "Comparing Chalet Zermatt Peak, The Omnia, and Cervo Resort for Dec 30 – Jan 2..." },
      { type: "card", card: "search" },
      { type: "agent", text: "Top pick: Chalet Zermatt Peak, 5★, ski-in/ski-out, Matterhorn view — CHF 1,200/night" },
      { type: "user", text: "Book Zermatt Peak, pay with ETH" },
      { type: "agent", text: "Processing ETH payment for your Alpine retreat..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Reservation confirmed! Your chalet awaits." },
      { type: "card", card: "hotel-confirm" },
      { type: "system", text: "✓ Chalet booked — Zermatt Peak, 3 nights" },
    ],
    searchItems: [
      { name: "Chalet Zermatt Peak ★5.0", price: "CHF 1,200", match: 97 },
      { name: "The Omnia Zermatt ★4.8", price: "CHF 980", match: 84 },
      { name: "Cervo Mountain Resort ★4.6", price: "CHF 750", match: 72 },
    ],
    checkout: { item: "Chalet Zermatt Peak, 3 nights", price: "CHF 3,600", payment: "crypto", crypto: { currency: "ETH", walletAddress: "0x3dF7...c82A", network: "Ethereum", txHash: "0xb19e...4d3f" } },
    fulfillment: { checkin: "Dec 30, 15:00", checkout: "Jan 2, 11:00", room: "Penthouse Chalet · Matterhorn View", conf: "ZP-20241" },
  },
];

// ─── Marketplace Variants ───────────────────────────────
const marketplaceVariants: ScenarioVariant[] = [
  {
    messages: [
      { type: "user", text: "Order Sony WH-1000XM5 headphones from Amazon" },
      { type: "agent", text: "Connecting to Amazon — checking availability for Sony WH-1000XM5..." },
      { type: "agent", text: "Sony WH-1000XM5, 4.9★ — $278 with Prime free shipping. In stock." },
      { type: "user", text: "Order it" },
      { type: "agent", text: "How would you like to pay? Card or crypto?" },
      { type: "user", text: "Card" },
      { type: "agent", text: "Processing with Visa •••• 4242, Prime express delivery..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Order placed via Amazon! Delivery: March 10." },
      { type: "card", card: "order-confirm" },
      { type: "system", text: "✓ Order confirmed — Sony WH-1000XM5 via Amazon" },
    ],
    searchItems: [
      { name: "Amazon — Sony WH-1000XM5", price: "$278", match: 97 },
    ],
    checkout: { item: "Sony WH-1000XM5 via Amazon", price: "$278", payment: "visa" },
    fulfillment: { item: "Sony WH-1000XM5", delivery: "Mar 10 · Prime Express", tracking: "AMZ-82910-EX" },
  },
  {
    messages: [
      { type: "user", text: "Buy iPad Pro M4 12.9\" from Apple Store" },
      { type: "agent", text: "Connecting to Apple Store — checking iPad Pro M4 12.9\" 256GB..." },
      { type: "agent", text: "iPad Pro M4 12.9\" 256GB — $1,099. Free engraving available. In stock for next-day delivery." },
      { type: "user", text: "Order it, pay with USDT" },
      { type: "agent", text: "Processing USDT payment for Apple Store order..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Apple order confirmed! Arriving tomorrow." },
      { type: "card", card: "order-confirm" },
      { type: "system", text: "✓ Order confirmed — iPad Pro M4 via Apple Store" },
    ],
    searchItems: [
      { name: "Apple Store — iPad Pro M4 12.9\"", price: "$1,099", match: 97 },
    ],
    checkout: { item: "iPad Pro M4 12.9\" via Apple Store", price: "$1,099", payment: "crypto", crypto: { currency: "USDT", walletAddress: "0x9bE3...7c1D", network: "Polygon", txHash: "0xd4a1...8e3c" } },
    fulfillment: { item: "iPad Pro M4 12.9\"", delivery: "Mar 11 · Next-Day", tracking: "APL-44190-ND" },
  },
  {
    messages: [
      { type: "user", text: "Order a DJI Mini 4 Pro from Best Buy" },
      { type: "agent", text: "Connecting to Best Buy — checking DJI Mini 4 Pro availability..." },
      { type: "agent", text: "DJI Mini 4 Pro Fly More Kit, 4K/60fps, 249g — $759. Available for in-store pickup or shipping." },
      { type: "user", text: "Ship it, pay with BTC" },
      { type: "agent", text: "Initiating Bitcoin payment for Best Buy order..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Crypto confirmed. Best Buy shipping tomorrow!" },
      { type: "card", card: "order-confirm" },
      { type: "system", text: "✓ Order confirmed — DJI Mini 4 Pro via Best Buy" },
    ],
    searchItems: [
      { name: "Best Buy — DJI Mini 4 Pro", price: "$759", match: 95 },
    ],
    checkout: { item: "DJI Mini 4 Pro via Best Buy", price: "$759", payment: "crypto", crypto: { currency: "BTC", walletAddress: "bc1q...m92k", network: "Bitcoin", txHash: "f8e7d6...1a2b" } },
    fulfillment: { item: "DJI Mini 4 Pro", delivery: "Mar 11 · Best Buy Express", tracking: "BB-91003-FM" },
  },
  {
    messages: [
      { type: "user", text: "Buy a Keychron Q1 Pro keyboard from keychron.com" },
      { type: "agent", text: "Connecting to Keychron — checking Q1 Pro availability..." },
      { type: "agent", text: "Keychron Q1 Pro, Gateron Brown switches, 4.8★ — $169. Ships from Shenzhen, 5-7 days international." },
      { type: "user", text: "Order it, pay with ETH" },
      { type: "agent", text: "Processing ETH payment for Keychron order..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Payment confirmed! Shipping from Keychron HQ." },
      { type: "card", card: "order-confirm" },
      { type: "system", text: "✓ Order confirmed — Keychron Q1 Pro" },
    ],
    searchItems: [
      { name: "Keychron — Q1 Pro Gateron Brown", price: "$169", match: 96 },
    ],
    checkout: { item: "Keychron Q1 Pro · Gateron Brown", price: "$169", payment: "crypto", crypto: { currency: "ETH", walletAddress: "0x2aD5...e71B", network: "Ethereum", txHash: "0x91bf...4c0a" } },
    fulfillment: { item: "Keychron Q1 Pro", delivery: "Mar 16 · International", tracking: "KC-33017-SZ" },
  },
  {
    messages: [
      { type: "user", text: "Compare prices for De'Longhi Magnifica espresso machine" },
      { type: "agent", text: "Comparing De'Longhi Magnifica across Amazon, MediaMarkt, and Currys..." },
      { type: "card", card: "search" },
      { type: "agent", text: "Best price: MediaMarkt — €389 with free descaler kit included." },
      { type: "user", text: "Order from MediaMarkt" },
      { type: "agent", text: "How would you like to pay? Card or crypto?" },
      { type: "user", text: "Mastercard" },
      { type: "agent", text: "Placing order with Mastercard •••• 8891 via MediaMarkt..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Done! Your espresso machine is on the way." },
      { type: "card", card: "order-confirm" },
      { type: "system", text: "✓ Order confirmed — De'Longhi via MediaMarkt" },
    ],
    searchItems: [
      { name: "MediaMarkt — De'Longhi Magnifica", price: "€389", match: 96 },
      { name: "Amazon — De'Longhi Magnifica", price: "€399", match: 90 },
      { name: "Currys — De'Longhi Magnifica", price: "€419", match: 78 },
    ],
    checkout: { item: "De'Longhi Magnifica via MediaMarkt", price: "€389", payment: "mastercard" },
    fulfillment: { item: "De'Longhi Magnifica", delivery: "Mar 14 · Standard", tracking: "MM-55020-EU" },
  },
];

// ─── Crypto Variants ────────────────────────────────────
const cryptoVariants: ScenarioVariant[] = [
  {
    messages: [
      { type: "user", text: "Swap 0.5 ETH to USDT on Uniswap" },
      { type: "agent", text: "Connecting to Uniswap V3 — checking ETH/USDT rate..." },
      { type: "agent", text: "Uniswap V3: 1 ETH = $3,420.50, 0.3% fee — you'll receive ~$1,710.25 USDT" },
      { type: "user", text: "Execute the swap" },
      { type: "agent", text: "Confirm the transaction in your wallet..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Swap complete on Uniswap! USDT credited to your wallet." },
      { type: "card", card: "wallet-confirm" },
      { type: "system", text: "✓ Swap executed — 0.5 ETH → 1,710.25 USDT via Uniswap" },
    ],
    searchItems: [
      { name: "Uniswap V3 — 0.3% fee", price: "$1,710.25", match: 97 },
    ],
    checkout: { item: "Uniswap: Swap 0.5 ETH → USDT", price: "$1,710.25", payment: "crypto", crypto: { currency: "ETH", walletAddress: "0x7a3B...9f2E", network: "Ethereum", txHash: "0xf4a2...c81d" } },
    fulfillment: { action: "Swap", from: "0.5 ETH", to: "1,710.25 USDT", protocol: "Uniswap V3", network: "Ethereum", fee: "0.3%", txHash: "0xf4a2...c81d" },
  },
  {
    messages: [
      { type: "user", text: "Send 500 USDC via MetaMask on Polygon" },
      { type: "agent", text: "Connecting to MetaMask — setting up USDC transfer on Polygon..." },
      { type: "agent", text: "Gas fee ~$0.01 on Polygon. Please confirm the recipient address." },
      { type: "user", text: "0x4dC1...b83A" },
      { type: "agent", text: "Sending 500 USDC to 0x4dC1...b83A via MetaMask on Polygon..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "MetaMask transfer confirmed in 2 seconds!" },
      { type: "card", card: "wallet-confirm" },
      { type: "system", text: "✓ Transfer complete — 500 USDC sent via MetaMask" },
    ],
    searchItems: [
      { name: "MetaMask — Polygon Transfer", price: "500 USDC", match: 96 },
    ],
    checkout: { item: "MetaMask: Send 500 USDC → 0x4dC1...b83A", price: "500 USDC", payment: "crypto", crypto: { currency: "USDC", walletAddress: "0x4dC1...b83A", network: "Polygon", txHash: "0x91bf...4c0a" } },
    fulfillment: { action: "Transfer", amount: "500 USDC", to: "0x4dC1...b83A", protocol: "MetaMask", network: "Polygon", fee: "$0.01", txHash: "0x91bf...4c0a" },
  },
  {
    messages: [
      { type: "user", text: "Buy 0.01 BTC on Coinbase" },
      { type: "agent", text: "Connecting to Coinbase — fetching BTC/USD rate..." },
      { type: "agent", text: "Coinbase: 1 BTC = $67,850 — 0.01 BTC costs $678.50. Instant settlement." },
      { type: "user", text: "Go ahead, pay with my USDT balance" },
      { type: "agent", text: "Converting 678.50 USDT → 0.01 BTC on Coinbase..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Bitcoin received in your Coinbase wallet!" },
      { type: "card", card: "wallet-confirm" },
      { type: "system", text: "✓ Purchase complete — 0.01 BTC via Coinbase" },
    ],
    searchItems: [
      { name: "Coinbase — Instant BTC Purchase", price: "$678.50", match: 96 },
    ],
    checkout: { item: "Coinbase: Buy 0.01 BTC", price: "$678.50", payment: "crypto", crypto: { currency: "USDT", walletAddress: "bc1q...xp7m", network: "Bitcoin", txHash: "a8f3e1...b42c" } },
    fulfillment: { action: "Purchase", amount: "0.01 BTC", cost: "678.50 USDT", protocol: "Coinbase", network: "Bitcoin", fee: "0.1%", txHash: "a8f3e1...b42c" },
  },
  {
    messages: [
      { type: "user", text: "Bridge 1000 USDT to Arbitrum using Stargate" },
      { type: "agent", text: "Connecting to Stargate Finance — setting up USDT bridge to Arbitrum..." },
      { type: "agent", text: "Stargate bridge: ~30 sec transfer time, fee $0.80. Ready to proceed." },
      { type: "user", text: "Bridge it" },
      { type: "agent", text: "Initiating Stargate cross-chain bridge..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Stargate bridge complete! USDT available on Arbitrum." },
      { type: "card", card: "wallet-confirm" },
      { type: "system", text: "✓ Bridged — 1,000 USDT to Arbitrum via Stargate" },
    ],
    searchItems: [
      { name: "Stargate Finance — 30s bridge", price: "$0.80 fee", match: 95 },
    ],
    checkout: { item: "Stargate: Bridge 1,000 USDT → Arbitrum", price: "1,000 USDT", payment: "crypto", crypto: { currency: "USDT", walletAddress: "0x9bE3...7c1D", network: "Arbitrum", txHash: "0xd4a1...8e3c" } },
    fulfillment: { action: "Bridge", amount: "1,000 USDT", from: "Ethereum", to: "Arbitrum", protocol: "Stargate Finance", fee: "$0.80", txHash: "0xd4a1...8e3c" },
  },
  {
    messages: [
      { type: "user", text: "Stake 2 ETH with Lido" },
      { type: "agent", text: "Connecting to Lido protocol — checking stETH rate and APY..." },
      { type: "agent", text: "Lido stETH: 3.8% APY, liquid staking — unstake anytime. No minimum." },
      { type: "user", text: "Stake it" },
      { type: "agent", text: "Staking 2 ETH via Lido protocol..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Lido staking confirmed! You received 2 stETH." },
      { type: "card", card: "wallet-confirm" },
      { type: "system", text: "✓ Staked — 2 ETH → 2 stETH via Lido at 3.8% APY" },
    ],
    searchItems: [
      { name: "Lido — stETH, 3.8% APY", price: "Liquid", match: 97 },
    ],
    checkout: { item: "Lido: Stake 2 ETH", price: "2 ETH", payment: "crypto", crypto: { currency: "ETH", walletAddress: "0x2aD5...e71B", network: "Ethereum", txHash: "0x55ca...1f9e" } },
    fulfillment: { action: "Stake", amount: "2 ETH", received: "2 stETH", protocol: "Lido", apy: "3.8%", txHash: "0x55ca...1f9e" },
  },
];

// ─── Mobile Operator Variants ───────────────────────────
const mobileVariants: ScenarioVariant[] = [
  {
    messages: [
      { type: "user", text: "I want a Bell unlimited plan with iPhone 16 Pro in Canada" },
      { type: "agent", text: "Connecting to Bell Canada — checking unlimited plans with iPhone 16 Pro..." },
      { type: "agent", text: "Bell Ultimate Unlimited + iPhone 16 Pro — CA$95/month, 24 months. Ready to activate." },
      { type: "user", text: "Sign me up" },
      { type: "agent", text: "How would you like to pay? Card or crypto?" },
      { type: "user", text: "Card" },
      { type: "agent", text: "Setting up Bell contract with Visa •••• 4242..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Bell plan activated! iPhone 16 Pro ships tomorrow." },
      { type: "card", card: "plan-confirm" },
      { type: "system", text: "✓ Activated — Bell Ultimate Unlimited + iPhone 16 Pro" },
    ],
    searchItems: [
      { name: "Bell — Ultimate Unlimited + iPhone 16 Pro", price: "CA$95/mo", match: 97 },
    ],
    checkout: { item: "Bell Ultimate Unlimited + iPhone 16 Pro", price: "CA$95/mo", payment: "visa" },
    fulfillment: { plan: "Bell Ultimate Unlimited 5G", device: "iPhone 16 Pro", billing: "CA$95/month × 24", activation: "Instant", shipping: "Device arrives Mar 11" },
  },
  {
    messages: [
      { type: "user", text: "Get me a T-Mobile Magenta MAX plan with Samsung S25 Ultra" },
      { type: "agent", text: "Connecting to T-Mobile US — checking Magenta MAX + S25 Ultra availability..." },
      { type: "agent", text: "T-Mobile Magenta MAX + Galaxy S25 Ultra — $90/month with device payments, 24 months." },
      { type: "user", text: "Let's do it, pay with USDT" },
      { type: "agent", text: "Processing USDT payment for T-Mobile activation..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "T-Mobile plan live! S25 Ultra shipping express." },
      { type: "card", card: "plan-confirm" },
      { type: "system", text: "✓ Activated — T-Mobile Magenta MAX + S25 Ultra" },
    ],
    searchItems: [
      { name: "T-Mobile — Magenta MAX + S25 Ultra", price: "$90/mo", match: 96 },
    ],
    checkout: { item: "T-Mobile Magenta MAX + S25 Ultra", price: "$90/mo", payment: "crypto", crypto: { currency: "USDT", walletAddress: "0x7a3B...9f2E", network: "Polygon", txHash: "0xab3f...c91d" } },
    fulfillment: { plan: "Magenta MAX Unlimited 5G", device: "Samsung S25 Ultra", billing: "$90/month × 24", activation: "Instant", shipping: "2-day express delivery" },
  },
  {
    messages: [
      { type: "user", text: "I want an Etisalat postpaid plan with 100GB in UAE" },
      { type: "agent", text: "Connecting to Etisalat UAE — checking Wasel Business 100GB..." },
      { type: "agent", text: "Etisalat Wasel Business 100GB — AED 300/month with free calls. eSIM activation included." },
      { type: "user", text: "Activate it" },
      { type: "agent", text: "How would you like to pay? Card or crypto?" },
      { type: "user", text: "Mastercard" },
      { type: "agent", text: "Activating Etisalat plan with Mastercard •••• 8891..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Etisalat postpaid active! eSIM ready." },
      { type: "card", card: "qr" },
      { type: "system", text: "✓ Activated — Etisalat Wasel 100GB Postpaid" },
    ],
    searchItems: [
      { name: "Etisalat — Wasel Business 100GB", price: "AED 300/mo", match: 95 },
    ],
    checkout: { item: "Etisalat Wasel Business 100GB", price: "AED 300/mo", payment: "mastercard" },
    fulfillment: {},
    qrValue: "https://anvar.ai/esim/activate/ETIS-100GB-UAE",
    qrLabel: "ETIS-WASEL-100GB",
  },
  {
    messages: [
      { type: "user", text: "Subscribe to Vodafone Red XL with a Pixel 9 Pro in Germany" },
      { type: "agent", text: "Connecting to Vodafone Germany — checking Red XL + Pixel 9 Pro..." },
      { type: "agent", text: "Vodafone Red XL Unlimited + Pixel 9 Pro — €59.99/month, 24 months. 5G included." },
      { type: "user", text: "Book it, pay with ETH" },
      { type: "agent", text: "Processing ETH payment for Vodafone contract..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Vodafone plan active! Pixel 9 Pro ships in 2 days." },
      { type: "card", card: "plan-confirm" },
      { type: "system", text: "✓ Activated — Vodafone Red XL + Pixel 9 Pro" },
    ],
    searchItems: [
      { name: "Vodafone — Red XL + Pixel 9 Pro", price: "€59.99/mo", match: 97 },
    ],
    checkout: { item: "Vodafone Red XL + Pixel 9 Pro", price: "€59.99/mo", payment: "crypto", crypto: { currency: "ETH", walletAddress: "0x5cA9...d32F", network: "Ethereum", txHash: "0x72ae...b10c" } },
    fulfillment: { plan: "Red XL Unlimited 5G", device: "Pixel 9 Pro", billing: "€59.99/month × 24", activation: "Instant", shipping: "Device arrives in 2 days" },
  },
  {
    messages: [
      { type: "user", text: "I need an Orange prepaid eSIM with 80GB data in France" },
      { type: "agent", text: "Connecting to Orange France — checking prepaid 80GB 5G plan..." },
      { type: "agent", text: "Orange Prepaid 80GB 5G — €19.99/month, no contract. eSIM activation instant." },
      { type: "user", text: "Buy it" },
      { type: "agent", text: "How would you like to pay? Card or crypto?" },
      { type: "user", text: "Card" },
      { type: "agent", text: "Purchasing Orange eSIM with Visa •••• 4242..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Orange eSIM activated! Scan to install." },
      { type: "card", card: "qr" },
      { type: "system", text: "✓ Activated — Orange Prepaid 80GB 5G eSIM" },
    ],
    searchItems: [
      { name: "Orange — Prepaid 80GB 5G eSIM", price: "€19.99/mo", match: 96 },
    ],
    checkout: { item: "Orange Prepaid 80GB 5G eSIM", price: "€19.99/mo", payment: "visa" },
    fulfillment: {},
    qrValue: "https://anvar.ai/esim/activate/ORANGE-80GB-FR",
    qrLabel: "ORANGE-PREP-80GB",
  },
  {
    messages: [
      { type: "user", text: "Compare all carriers for iPhone 16 Pro Max at Best Buy" },
      { type: "agent", text: "Connecting to Best Buy — comparing all carrier deals for iPhone 16 Pro Max..." },
      { type: "card", card: "search" },
      { type: "agent", text: "Best value: T-Mobile via Best Buy — iPhone 16 Pro Max, $0 down + Go5G Plus — $33.34/month device" },
      { type: "user", text: "Go with T-Mobile, pay with BTC" },
      { type: "agent", text: "Processing Best Buy + T-Mobile activation with Bitcoin..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Ordered! Pick up at your nearest Best Buy tomorrow." },
      { type: "card", card: "plan-confirm" },
      { type: "system", text: "✓ Ordered — iPhone 16 Pro Max via Best Buy + T-Mobile" },
    ],
    searchItems: [
      { name: "T-Mobile via Best Buy — $0 down", price: "$33.34/mo", match: 96 },
      { name: "AT&T via Best Buy — $0 down", price: "$35/mo device", match: 90 },
      { name: "Verizon via Best Buy — $0 down", price: "$36.11/mo", match: 88 },
    ],
    checkout: { item: "Best Buy + T-Mobile: iPhone 16 Pro Max", price: "$33.34/mo + plan", payment: "crypto", crypto: { currency: "BTC", walletAddress: "bc1q...xp7m", network: "Bitcoin", txHash: "c7d8e9...f1a2" } },
    fulfillment: { plan: "T-Mobile Go5G Plus", device: "iPhone 16 Pro Max", billing: "$33.34/mo device + plan", activation: "In-store pickup", extras: "Best Buy store: ready tomorrow" },
  },
];

// ─── Halal Banking Variants ─────────────────────────────
const bankingVariants: ScenarioVariant[] = [
  {
    messages: [
      { type: "user", text: "I want to open a savings account with Al Rayan Bank" },
      { type: "agent", text: "Great choice — Al Rayan offers a Mudarabah Savings account with 4.8% expected profit, FCA regulated. Let me set it up." },
      { type: "agent", text: "Full legal name?" },
      { type: "user", text: "Fatima Zahra Benali" },
      { type: "agent", text: "Date of birth?" },
      { type: "user", text: "22 July 1988" },
      { type: "agent", text: "Email address?" },
      { type: "user", text: "fatima.benali@gmail.com" },
      { type: "agent", text: "Phone number?" },
      { type: "user", text: "+44 7700 900123" },
      { type: "agent", text: "Please take a photo of your passport — data page only." },
      { type: "card", card: "id-upload" },
      { type: "agent", text: "Passport captured. Now a selfie for biometric verification." },
      { type: "user", text: "📸 Selfie taken" },
      { type: "agent", text: "Running identity verification, biometric match, and AML screening..." },
      { type: "card", card: "kyc" },
      { type: "agent", text: "All verified! Your Al Rayan Mudarabah Savings account is now active. Here are your account details:" },
      { type: "card", card: "bank-confirm" },
      { type: "agent", text: "You can access your account via the Al Rayan mobile app or online at alrayanbank.co.uk. Your login credentials have been sent to fatima.benali@gmail.com." },
      { type: "system", text: "✓ Account active — Al Rayan Mudarabah, 4.8% profit" },
    ],
    searchItems: [
      { name: "Al Rayan UK — Mudarabah 4.8%", price: "No min.", match: 96 },
    ],
    checkout: { item: "Mudarabah Savings Account", price: "No fees", payment: "visa" },
    fulfillment: { type: "Mudarabah Savings", bank: "Al Rayan Bank UK", profitRate: "4.8% expected", status: "Active", accountNo: "72819304", sortCode: "30-00-45", iban: "GB29 ARBN 3000 4572 8193 04", sharia: "AAOIFI Certified", access: "App & Online Banking" },
  },
  {
    messages: [
      { type: "user", text: "Open a current account with Emirates Islamic" },
      { type: "agent", text: "Emirates Islamic Kunooz — free Visa debit card, no monthly fees. Let's get started." },
      { type: "agent", text: "Full name as on your Emirates ID?" },
      { type: "user", text: "Khalid Omar Al-Mansouri" },
      { type: "agent", text: "Emirates ID number?" },
      { type: "user", text: "784-1992-XXXXXXX-X" },
      { type: "agent", text: "Email address?" },
      { type: "user", text: "khalid.mansouri@email.com" },
      { type: "agent", text: "Mobile number?" },
      { type: "user", text: "+971 55 XXX XXXX" },
      { type: "agent", text: "Please take a photo of your Emirates ID — front side." },
      { type: "card", card: "id-upload" },
      { type: "agent", text: "Got it. Now a quick selfie for facial verification." },
      { type: "user", text: "📸 Done" },
      { type: "agent", text: "Verifying with UAE ICP database, running biometrics and AML checks..." },
      { type: "card", card: "kyc" },
      { type: "agent", text: "Approved! Your Emirates Islamic Kunooz account is active. Here are your details:" },
      { type: "card", card: "bank-confirm" },
      { type: "agent", text: "Download the EI app to manage your account. Your Visa debit card will arrive in 3 business days. Temporary virtual card is already active in the app." },
      { type: "system", text: "✓ Account active — Emirates Islamic Kunooz + Visa Debit" },
    ],
    searchItems: [
      { name: "Emirates Islamic — Kunooz", price: "Free", match: 95 },
    ],
    checkout: { item: "Emirates Islamic Kunooz + Visa", price: "Free", payment: "visa" },
    fulfillment: { type: "Current Account", bank: "Emirates Islamic", profitRate: "N/A", status: "Active", accountNo: "0351-XXXXXX-001", iban: "AE07 0351 0000 XXXX XX001", sharia: "UAE Central Bank Approved", access: "EI Mobile App", extras: "Visa Debit — arrives 3 days" },
  },
  {
    messages: [
      { type: "user", text: "I want to apply for home financing with Bank Islam Malaysia" },
      { type: "agent", text: "Bank Islam Baiti — Tawarruq-based home financing, 3.85% p.a. fixed, up to 35 years. Let me start your application." },
      { type: "agent", text: "Full name?" },
      { type: "user", text: "Ahmad bin Abdullah" },
      { type: "agent", text: "MyKad number?" },
      { type: "user", text: "900315-XX-XXXX" },
      { type: "agent", text: "Email address?" },
      { type: "user", text: "ahmad.abdullah@gmail.com" },
      { type: "agent", text: "Monthly gross income?" },
      { type: "user", text: "RM 8,500" },
      { type: "agent", text: "Employer name and years of service?" },
      { type: "user", text: "Petronas — 6 years" },
      { type: "agent", text: "Property value?" },
      { type: "user", text: "RM 500,000" },
      { type: "agent", text: "Please take a photo of your MyKad — front and back." },
      { type: "card", card: "id-upload" },
      { type: "agent", text: "MyKad captured. Now a selfie for biometric verification." },
      { type: "user", text: "📸 Selfie taken" },
      { type: "agent", text: "Verifying identity, checking CCRIS/CTOS credit score, and AML screening..." },
      { type: "card", card: "kyc" },
      { type: "agent", text: "Pre-approved! Here's your financing summary:" },
      { type: "card", card: "bank-confirm" },
      { type: "agent", text: "A Bank Islam representative will contact you at ahmad.abdullah@gmail.com within 24 hours to schedule property valuation. Track your application in the Bank Islam GO app." },
      { type: "system", text: "✓ Pre-approved — Bank Islam Baiti, RM 500K" },
    ],
    searchItems: [
      { name: "Bank Islam — Baiti 3.85%", price: "RM 500K", match: 97 },
    ],
    checkout: { item: "Baiti Home Financing Pre-Approval", price: "RM 500,000", payment: "visa" },
    fulfillment: { type: "Tawarruq Home Financing", bank: "Bank Islam Malaysia", profitRate: "3.85% p.a. fixed", status: "Pre-Approved", applicationRef: "BI-HF-2024-38291", sharia: "BNM Sharia Approved", term: "35 years", access: "Bank Islam GO App" },
  },
  {
    messages: [
      { type: "user", text: "Send $5,000 to my brother via Amana Bank wire transfer" },
      { type: "agent", text: "Amana Bank international wire — $6 fee, 2-day delivery, zero riba. Let me process this." },
      { type: "agent", text: "Recipient's full name?" },
      { type: "user", text: "Yusuf Demir" },
      { type: "agent", text: "Recipient's IBAN?" },
      { type: "user", text: "TR33 0006 1005 1978 XXXX XXXX XX" },
      { type: "agent", text: "Your email for transfer confirmation?" },
      { type: "user", text: "nadia.hassan@gmail.com" },
      { type: "agent", text: "Please take a photo of your ID for transfer compliance." },
      { type: "card", card: "id-upload" },
      { type: "agent", text: "ID captured. Verifying sender identity and AML screening..." },
      { type: "card", card: "kyc" },
      { type: "agent", text: "Verified! Transfer submitted. Here's your confirmation:" },
      { type: "card", card: "bank-confirm" },
      { type: "agent", text: "Transfer receipt and tracking link sent to nadia.hassan@gmail.com. You can track status in the Amana Bank portal." },
      { type: "system", text: "✓ Transferred — $5,000 via Amana Bank, $6 fee, 2 days" },
    ],
    searchItems: [
      { name: "Amana Bank — 2-Day Wire", price: "$6 fee", match: 91 },
    ],
    checkout: { item: "Amana Bank Wire — $5,000", price: "$5,006", payment: "visa" },
    fulfillment: { type: "International Wire Transfer", bank: "Amana Bank", status: "Submitted", transferRef: "AMN-WR-2024-7291", amount: "$5,000", fee: "$6", sharia: "Zero Riba", term: "2 business days", access: "Amana Portal" },
  },
  {
    messages: [
      { type: "user", text: "Open a gold investment account with Dubai Islamic Bank" },
      { type: "agent", text: "DIB Gold Savings — physical gold-backed, Sharia certified, minimum $500. Let's set it up." },
      { type: "agent", text: "Full name?" },
      { type: "user", text: "Tariq Suleiman Nasser" },
      { type: "agent", text: "Nationality?" },
      { type: "user", text: "Emirati" },
      { type: "agent", text: "Email address?" },
      { type: "user", text: "tariq.nasser@email.com" },
      { type: "agent", text: "How much would you like to deposit initially?" },
      { type: "user", text: "$1,000" },
      { type: "agent", text: "Please take a photo of your passport data page." },
      { type: "card", card: "id-upload" },
      { type: "agent", text: "Passport captured. Now a selfie for biometric match." },
      { type: "user", text: "📸 Done" },
      { type: "agent", text: "Running identity verification, investor suitability, and AML screening..." },
      { type: "card", card: "kyc" },
      { type: "agent", text: "Verified! Your gold account is active. Here are your details:" },
      { type: "card", card: "bank-confirm" },
      { type: "agent", text: "Access your gold holdings via the DIB mobile app. You can buy, sell, or convert gold anytime. Account details sent to tariq.nasser@email.com." },
      { type: "system", text: "✓ Account active — DIB Gold Savings, 0.47 oz" },
    ],
    searchItems: [
      { name: "Dubai Islamic Bank — Gold Savings", price: "$500 min.", match: 97 },
    ],
    checkout: { item: "DIB Gold — Initial Deposit", price: "$1,000", payment: "visa" },
    fulfillment: { type: "Gold Savings Account", bank: "Dubai Islamic Bank", profitRate: "Gold-linked returns", status: "Active", accountNo: "DIB-GLD-48201", goldBalance: "0.47 oz", sharia: "AAOIFI Certified", term: "No lock-in", access: "DIB Mobile App" },
  },
  {
    messages: [
      { type: "user", text: "Set up a junior education savings plan with Kuwait Finance House" },
      { type: "agent", text: "KFH Libshara Junior — 5.3% expected profit, min BHD 20/month. Let me get started." },
      { type: "agent", text: "How much monthly?" },
      { type: "user", text: "BHD 50" },
      { type: "agent", text: "Your full name?" },
      { type: "user", text: "Khalid Al-Mansour" },
      { type: "agent", text: "Civil ID number?" },
      { type: "user", text: "290XXXXXXX" },
      { type: "agent", text: "Email address?" },
      { type: "user", text: "khalid.mansour@gmail.com" },
      { type: "agent", text: "Son's full name?" },
      { type: "user", text: "Omar Al-Mansour" },
      { type: "agent", text: "Son's date of birth?" },
      { type: "user", text: "12 Jan 2016" },
      { type: "agent", text: "Please take a photo of your Civil ID card." },
      { type: "card", card: "id-upload" },
      { type: "agent", text: "Civil ID captured. Now a selfie for parent verification." },
      { type: "user", text: "📸 Done" },
      { type: "agent", text: "Verifying parent identity and setting up junior account..." },
      { type: "card", card: "kyc" },
      { type: "agent", text: "Verified! Education fund is active. Here's the summary:" },
      { type: "card", card: "bank-confirm" },
      { type: "agent", text: "Manage the plan via the KFH Online app. Monthly statements will be sent to khalid.mansour@gmail.com. Auto-debit of BHD 50 starts next month." },
      { type: "system", text: "✓ Active — KFH Libshara Junior, BHD 50/month" },
    ],
    searchItems: [
      { name: "KFH — Libshara Junior 5.3%", price: "BHD 20/mo min.", match: 97 },
    ],
    checkout: { item: "KFH Libshara Junior — 1st Contribution", price: "BHD 50", payment: "mastercard" },
    fulfillment: { type: "Junior Education Savings", bank: "Kuwait Finance House", profitRate: "5.3% expected", status: "Active", accountNo: "KFH-LB-JR-00291", beneficiary: "Omar Al-Mansour", sharia: "KFH Sharia Board", term: "18-year term", access: "KFH Online App" },
  },
];

// ─── Halal Stocks Variants ──────────────────────────────
const stockVariants: ScenarioVariant[] = [
  {
    messages: [
      { type: "user", text: "Invest $500 in halal tech stocks via Wahed Invest" },
      { type: "agent", text: "Connecting to Wahed Invest — screening halal tech stocks..." },
      { type: "agent", text: "Wahed portfolio: AAPL, MSFT, NVDA — all AAOIFI certified. $500 allocated across 3 stocks." },
      { type: "user", text: "Execute the trades" },
      { type: "agent", text: "How would you like to pay? Card or crypto?" },
      { type: "user", text: "Card" },
      { type: "agent", text: "Placing orders via Wahed Invest with Visa •••• 4242..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Wahed portfolio created! Here's your summary." },
      { type: "card", card: "stock-confirm" },
      { type: "system", text: "✓ Invested — $500 via Wahed Invest" },
    ],
    searchItems: [
      { name: "Wahed Invest — Halal Tech Portfolio", price: "$500", match: 96 },
    ],
    checkout: { item: "Wahed Invest: Halal Tech Portfolio", price: "$500", payment: "visa" },
    fulfillment: { action: "Buy", portfolio: "Halal Tech", stocks: "AAPL, MSFT, NVDA", amount: "$500", screening: "AAOIFI Compliant", status: "Executed", platform: "Wahed Invest" },
  },
  {
    messages: [
      { type: "user", text: "Set up monthly $200 auto-invest in SPUS ETF" },
      { type: "agent", text: "Connecting to SP Funds — setting up recurring SPUS investment..." },
      { type: "agent", text: "SPUS S&P 500 Sharia ETF — 0.49% expense ratio, AAOIFI certified. $200/month recurring." },
      { type: "user", text: "Start it" },
      { type: "agent", text: "How would you like to pay the monthly contribution? Card or crypto?" },
      { type: "user", text: "Mastercard" },
      { type: "agent", text: "Setting up monthly auto-invest with Mastercard •••• 8891..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "SPUS recurring investment active!" },
      { type: "card", card: "stock-confirm" },
      { type: "system", text: "✓ Active — $200/month into SPUS via SP Funds" },
    ],
    searchItems: [
      { name: "SP Funds — SPUS S&P 500 Sharia ETF", price: "$200/mo", match: 97 },
    ],
    checkout: { item: "SP Funds: SPUS Monthly Auto-Invest", price: "$200/mo", payment: "mastercard" },
    fulfillment: { action: "Auto-Invest", portfolio: "SPUS S&P 500 Sharia ETF", stocks: "SPUS", amount: "$200/month", screening: "AAOIFI Compliant", status: "Recurring Active", platform: "SP Funds" },
  },
  {
    messages: [
      { type: "user", text: "Screen stocks for Sharia compliance using Zoya" },
      { type: "agent", text: "Connecting to Zoya — running Sharia compliance screening on your watchlist..." },
      { type: "agent", text: "Zoya screening results: AAPL ✓ Halal, MSFT ✓ Halal, NVDA ✓ Halal, TSLA ✗ Non-compliant (debt ratio)." },
      { type: "user", text: "Invest $1,000 in the compliant ones equally" },
      { type: "agent", text: "How would you like to pay? Card or crypto?" },
      { type: "user", text: "Card" },
      { type: "agent", text: "Placing orders via Zoya with Visa •••• 4242..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Portfolio created via Zoya!" },
      { type: "card", card: "stock-confirm" },
      { type: "system", text: "✓ Invested — $1,000 in Zoya-screened stocks" },
    ],
    searchItems: [
      { name: "Zoya — Halal Screened Portfolio", price: "$1,000", match: 95 },
    ],
    checkout: { item: "Zoya: Halal Screened Portfolio", price: "$1,000", payment: "visa" },
    fulfillment: { action: "Buy", portfolio: "Zoya Screened", stocks: "AAPL, MSFT, NVDA", amount: "$1,000", screening: "Zoya AAOIFI", status: "Executed", platform: "Zoya" },
  },
  {
    messages: [
      { type: "user", text: "Check my Musaffa portfolio compliance status" },
      { type: "agent", text: "Connecting to Musaffa — running compliance audit on your holdings..." },
      { type: "agent", text: "Musaffa audit: 8/10 stocks halal ✓. 2 flagged — BABA (revenue mix), COIN (interest income). Recommend replacing with INFY and TSM." },
      { type: "user", text: "Replace both, pay with USDT" },
      { type: "agent", text: "Selling flagged stocks and buying INFY + TSM via Musaffa..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "Portfolio rebalanced! Now 100% halal compliant." },
      { type: "card", card: "stock-confirm" },
      { type: "system", text: "✓ Rebalanced — 100% Musaffa compliant" },
    ],
    searchItems: [
      { name: "Musaffa — Portfolio Rebalance", price: "$840", match: 94 },
    ],
    checkout: { item: "Musaffa: Compliance Rebalance", price: "$840", payment: "crypto", crypto: { currency: "USDT", walletAddress: "0x7a3B...9f2E", network: "Polygon", txHash: "0xd9c2...a41f" } },
    fulfillment: { action: "Rebalance", portfolio: "Musaffa Compliant", stocks: "Replaced BABA→INFY, COIN→TSM", amount: "$840", screening: "Musaffa AAOIFI", status: "Executed", platform: "Musaffa" },
  },
  {
    messages: [
      { type: "user", text: "Compare halal ETFs — SPUS vs HLAL vs UMMA" },
      { type: "agent", text: "Comparing Sharia-compliant ETFs across SP Funds, Wahed, and UMMA..." },
      { type: "card", card: "search" },
      { type: "agent", text: "SPUS: 0.49% expense, S&P 500 tracking. HLAL: 0.50%, FTSE USA. UMMA: 0.65%, Dow Jones. Best overall: SPUS." },
      { type: "user", text: "Invest $2,000 in SPUS, pay with ETH" },
      { type: "agent", text: "Processing ETH payment and investing in SPUS..." },
      { type: "card", card: "checkout" },
      { type: "agent", text: "SPUS position active!" },
      { type: "card", card: "stock-confirm" },
      { type: "system", text: "✓ Invested — $2,000 in SPUS halal ETF" },
    ],
    searchItems: [
      { name: "SPUS — S&P 500 Sharia, 0.49%", price: "$2,000", match: 97 },
      { name: "HLAL — Wahed FTSE USA, 0.50%", price: "$2,000", match: 89 },
      { name: "UMMA — Dow Jones Islamic, 0.65%", price: "$2,000", match: 82 },
    ],
    checkout: { item: "SPUS ETF — Lump Sum", price: "$2,000", payment: "crypto", crypto: { currency: "ETH", walletAddress: "0x5cA9...d32F", network: "Ethereum", txHash: "0x88cf...2d1e" } },
    fulfillment: { action: "Buy", portfolio: "SPUS S&P 500 Sharia", stocks: "SPUS", amount: "$2,000", screening: "AAOIFI Compliant", status: "Executed", platform: "SP Funds" },
  },
];

const tabs: TabConfig[] = [
  { id: "esim", label: "eSIM", icon: Wifi, variants: esimVariants },
  { id: "flights", label: "Flights", icon: Plane, variants: flightVariants },
  { id: "hotels", label: "Hotels", icon: Building, variants: hotelVariants },
  { id: "marketplace", label: "Market", icon: ShoppingBag, variants: marketplaceVariants },
  { id: "crypto", label: "Crypto", icon: Wallet, variants: cryptoVariants },
  { id: "mobile", label: "Mobile", icon: Smartphone, variants: mobileVariants },
  { id: "banking", label: "Banking", icon: Landmark, variants: bankingVariants },
  { id: "stocks", label: "Stocks", icon: TrendingUp, variants: stockVariants },
];

// ─── Main Component ─────────────────────────────────────
const AnvarChatDemo = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "0px" });
  const [activeTab, setActiveTab] = useState(0);
  const [variantIdx, setVariantIdx] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [runKey, setRunKey] = useState(0);

  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    setRunKey((k) => k + 1);
  };

  useEffect(() => {
    if (inView) setRunKey((k) => k + 1);
  }, [inView]);

  const handleRestart = useCallback(() => {
    // Advance to next variant for current tab
    setVariantIdx((prev) => {
      const next = [...prev];
      next[activeTab] = (next[activeTab] + 1) % tabs[activeTab].variants.length;
      return next;
    });
    setRunKey((k) => k + 1);
  }, [activeTab]);

  const currentVariant = tabs[activeTab].variants[variantIdx[activeTab]];

  return (
    <div ref={ref} className="glass-card-strong rounded-xl overflow-hidden glow-soft max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex flex-wrap border-b border-border/50">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            onClick={() => handleTabChange(i)}
            className={`flex items-center justify-center gap-1.5 px-3 py-3 text-[11px] font-medium transition-all duration-300 whitespace-nowrap ${
              activeTab === i
                ? "text-platinum border-b border-platinum/40 bg-foreground/[0.03]"
                : "text-muted-foreground hover:text-silver"
            }`}
          >
            <t.icon size={12} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border/30">
        <div className="w-7 h-7 rounded-lg glass-card flex items-center justify-center">
          <span className="font-display font-bold text-xs text-platinum">A</span>
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">Anvar AI Agent</div>
          <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-platinum/60 animate-pulse" />
            Active
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <AnimatePresence mode="wait">
        <ChatFlow
          key={`${activeTab}-${runKey}`}
          variant={currentVariant}
          tabId={tabs[activeTab].id}
          active={inView}
          onRestart={handleRestart}
        />
      </AnimatePresence>
    </div>
  );
};

// ─── Chat Flow ──────────────────────────────────────────
const ChatFlow = ({ variant, tabId, active, onRestart }: { variant: ScenarioVariant; tabId: string; active: boolean; onRestart: () => void }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [currentDone, setCurrentDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !currentDone) return;
    if (visibleCount >= variant.messages.length) {
      const restartTimer = setTimeout(onRestart, 3000);
      return () => clearTimeout(restartTimer);
    }

    const msg = variant.messages[visibleCount];
    const pause = msg.type === "card" ? 300 : msg.type === "system" ? 500 : 600;
    const timer = setTimeout(() => {
      setVisibleCount((v) => v + 1);
      setCurrentDone(false);
    }, pause);
    return () => clearTimeout(timer);
  }, [currentDone, active, visibleCount, variant, onRestart]);

  useEffect(() => {
    if (active && visibleCount === 0) {
      const t = setTimeout(() => {
        setVisibleCount(1);
        setCurrentDone(false);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [active]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [visibleCount, currentDone]);

  const onMsgDone = useCallback(() => setCurrentDone(true), []);

  return (
    <motion.div
      ref={scrollRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-3 min-h-[400px] max-h-[460px] overflow-y-auto"
    >
      {variant.messages.slice(0, visibleCount).map((msg, i) => {
        const isLast = i === visibleCount - 1;
        const shouldAnimate = isLast && !currentDone;

        if (msg.type === "user") {
          return (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
              <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-md bg-platinum/10 border border-platinum/15 text-sm text-foreground">
                {shouldAnimate ? (
                  <TypeWriter text={msg.text} speed={40} onDone={onMsgDone} />
                ) : (
                  <>{msg.text}</>
                )}
              </div>
            </motion.div>
          );
        }

        if (msg.type === "agent") {
          return (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-bl-md glass-card text-sm text-silver">
                {shouldAnimate ? (
                  <TypeWriter text={msg.text} speed={25} onDone={onMsgDone} />
                ) : (
                  <>{msg.text}</>
                )}
              </div>
            </motion.div>
          );
        }

        if (msg.type === "card") {
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <InlineCard type={msg.card} variant={variant} tabId={tabId} onDone={onMsgDone} animate={shouldAnimate} />
            </motion.div>
          );
        }

        if (msg.type === "system") {
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mx-2">
              <div className="rounded-lg py-3 px-4 bg-platinum/5 border border-platinum/10 text-xs font-mono text-platinum text-center">
                {shouldAnimate ? (
                  <TypeWriter text={msg.text} speed={20} onDone={onMsgDone} />
                ) : (
                  msg.text
                )}
              </div>
            </motion.div>
          );
        }

        return null;
      })}

      {visibleCount > 0 && visibleCount < variant.messages.length && currentDone && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1 pl-2">
          {[0, 1, 2].map((j) => (
            <motion.div
              key={j}
              className="w-1.5 h-1.5 rounded-full bg-silver/30"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: j * 0.2 }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

// ─── TypeWriter ─────────────────────────────────────────
const TypeWriter = ({ text, speed = 30, onDone }: { text: string; speed?: number; onDone: () => void }) => {
  const [chars, setChars] = useState(0);

  useEffect(() => {
    setChars(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= text.length) {
        setChars(text.length);
        clearInterval(interval);
        onDone();
        return;
      }
      setChars(i);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onDone]);

  return (
    <>
      {text.slice(0, chars)}
      {chars < text.length && (
        <span className="inline-block w-[2px] h-3.5 bg-platinum/60 ml-[1px] animate-blink align-middle" />
      )}
    </>
  );
};

// ─── Inline Cards ───────────────────────────────────────
const InlineCard = ({ type, variant, tabId, onDone, animate }: { type: string; variant: ScenarioVariant; tabId: string; onDone: () => void; animate: boolean }) => {
  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(onDone, type === "checkout" ? 3500 : type === "kyc" ? 5500 : type === "id-upload" ? 3000 : 1800);
    return () => clearTimeout(t);
  }, [animate, onDone, type]);

  if (type === "search") return <SearchCard items={variant.searchItems} />;
  if (type === "checkout") return <CheckoutCard info={variant.checkout} animate={animate} />;
  if (type === "kyc") return <KYCCard animate={animate} />;
  if (type === "id-upload") return <IDUploadCard animate={animate} />;
  if (type === "qr") return <QRCard value={variant.qrValue || "https://anvar.ai"} label={variant.qrLabel || "ANVAR-QR"} />;
  if (type === "boarding") return <BoardingCard info={variant.boardingInfo} />;
  if (type === "hotel-confirm") return <HotelConfirmCard info={variant.fulfillment} />;
  if (type === "order-confirm") return <OrderConfirmCard info={variant.fulfillment} />;
  if (type === "wallet-confirm") return <WalletConfirmCard info={variant.fulfillment} />;
  if (type === "plan-confirm") return <PlanConfirmCard info={variant.fulfillment} />;
  if (type === "bank-confirm") return <BankConfirmCard info={variant.fulfillment} />;
  if (type === "stock-confirm") return <StockConfirmCard info={variant.fulfillment} />;
  return null;
};

const SearchCard = ({ items }: { items: { name: string; price: string; match: number }[] }) => (
  <div className="mx-2 glass-card rounded-lg p-3 space-y-2">
    <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
      <Check size={10} className="text-platinum/60" />
      <span>Scanning service network...</span>
    </div>
    {items.map((p, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.3 }}
        className={`flex items-center justify-between text-[11px] py-1.5 px-2 rounded ${
          p.match > 90 ? "bg-platinum/5 border border-platinum/10" : ""
        }`}
      >
        <span className={p.match > 90 ? "text-platinum font-medium" : "text-muted-foreground"}>{p.name}</span>
        <div className="flex items-center gap-3">
          <span className="text-silver/40">{p.price}</span>
          <span className={`font-mono text-[10px] ${p.match > 90 ? "text-platinum" : "text-muted-foreground/30"}`}>{p.match}%</span>
        </div>
      </motion.div>
    ))}
  </div>
);

const cryptoIcons: Record<CryptoCurrency, { symbol: string; color: string }> = {
  USDT: { symbol: "₮", color: "hsl(142 60% 45%)" },
  ETH: { symbol: "Ξ", color: "hsl(228 60% 65%)" },
  BTC: { symbol: "₿", color: "hsl(33 90% 55%)" },
  USDC: { symbol: "$", color: "hsl(210 70% 55%)" },
};

const CheckoutCard = ({ info, animate }: { info: { item: string; price: string; payment: PaymentMethod; crypto?: CryptoInfo }; animate: boolean }) => {
  const [stage, setStage] = useState<"select" | "wallet" | "processing" | "done">("select");

  useEffect(() => {
    if (!animate) { setStage("done"); return; }
    if (info.payment === "crypto") {
      const t1 = setTimeout(() => setStage("wallet"), 700);
      const t2 = setTimeout(() => setStage("processing"), 1800);
      const t3 = setTimeout(() => setStage("done"), 3200);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    } else {
      const t1 = setTimeout(() => setStage("processing"), 600);
      const t2 = setTimeout(() => setStage("done"), 2200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [animate, info.payment]);

  const isCrypto = info.payment === "crypto";
  const crypto = info.crypto;
  const cardLabel = info.payment === "mastercard" ? "MC" : "VISA";

  return (
    <div className="mx-2 glass-card-strong rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-border/30 flex items-center gap-2">
        <CreditCard size={12} className="text-silver" />
        <span className="text-[10px] font-mono text-silver">Secure Checkout</span>
        <Shield size={9} className="text-muted-foreground/30 ml-auto" />
      </div>
      <div className="p-3 space-y-2">
        <div className="flex justify-between text-[11px]">
          <span className="text-muted-foreground">{info.item}</span>
          <span className="text-foreground">{info.price}</span>
        </div>

        {isCrypto && crypto ? (
          <>
            {/* Currency selector */}
            <div className="flex gap-1.5">
              {(["USDT", "ETH", "BTC", "USDC"] as CryptoCurrency[]).map((c) => {
                const icon = cryptoIcons[c];
                const isSelected = crypto.currency === c;
                return (
                  <div
                    key={c}
                    className={`flex-1 rounded py-1.5 text-center text-[9px] font-mono transition-all duration-300 ${
                      isSelected
                        ? "border border-platinum/30 bg-platinum/10 text-platinum"
                        : "border border-border/20 text-muted-foreground/40"
                    }`}
                  >
                    <span style={{ color: isSelected ? icon.color : undefined }} className="text-[11px]">{icon.symbol}</span>
                    <span className="ml-1">{c}</span>
                  </div>
                );
              })}
            </div>

            {/* Wallet address field */}
            <div className="glass-card rounded px-2 py-1.5 space-y-1">
              <div className="text-[9px] text-muted-foreground/50 font-mono">Wallet Address</div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-silver font-mono flex-1 truncate">
                  {stage === "select" ? "Enter wallet or scan QR..." : crypto.walletAddress}
                </span>
                {stage !== "select" && <Check size={10} className="text-platinum/40 shrink-0" />}
              </div>
            </div>

            {/* Network badge */}
            {stage !== "select" && (
              <div className="flex items-center justify-between text-[9px] font-mono">
                <span className="text-muted-foreground/40">Network</span>
                <span className="text-muted-foreground/60 px-1.5 py-0.5 rounded bg-foreground/5">{crypto.network}</span>
              </div>
            )}
          </>
        ) : (
          <div className="glass-card rounded px-2 py-1.5 flex items-center gap-2">
            <div className="w-7 h-4 rounded bg-foreground/10 flex items-center justify-center text-[7px] font-bold text-silver">{cardLabel}</div>
            <span className="text-[10px] text-muted-foreground">•••• {info.payment === "mastercard" ? "8891" : "4242"}</span>
            <Check size={10} className="text-platinum/40 ml-auto" />
          </div>
        )}

        {/* Status bar */}
        <div className={`rounded py-2 text-center text-[11px] font-medium transition-all duration-500 ${
          stage === "done" ? "bg-platinum/10 text-platinum border border-platinum/20"
            : stage === "processing" ? "bg-foreground/5 text-muted-foreground border border-border/30"
              : "bg-foreground/10 text-foreground border border-border/30"
        }`}>
          {stage === "done" ? (
            <span className="flex items-center justify-center gap-1">
              <Check size={12} />
              {isCrypto && crypto ? (
                <span className="font-mono text-[10px]">Tx {crypto.txHash} confirmed</span>
              ) : "Confirmed"}
            </span>
          ) : stage === "processing" ? (
            <span className="flex items-center justify-center gap-1">
              <Loader2 size={12} className="animate-spin" />
              {isCrypto ? "Broadcasting to network..." : "Processing..."}
            </span>
          ) : (
            `Pay ${info.price}`
          )}
        </div>
      </div>
    </div>
  );
};

const kycSteps = [
  { icon: User, label: "Personal Information", value: "Identity Confirmed ✓", statusText: "collecting..." },
  { icon: FileText, label: "Document Scan", value: "Passport ••••7291 ✓", statusText: "scanning..." },
  { icon: MapPin, label: "Address Verification", value: "Dubai Marina, UAE", statusText: "verifying..." },
  { icon: Camera, label: "Biometric Match", value: "99.7% face match", statusText: "analyzing..." },
  { icon: Shield, label: "AML / Sanctions Check", value: "Clear — no flags", statusText: "screening..." },
];

const KYCCard = ({ animate }: { animate: boolean }) => {
  const [step, setStep] = useState(animate ? -1 : kycSteps.length);

  useEffect(() => {
    if (!animate) { setStep(kycSteps.length); return; }
    const timers: ReturnType<typeof setTimeout>[] = [];
    kycSteps.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i), 800 + i * 800));
    });
    timers.push(setTimeout(() => setStep(kycSteps.length), 800 + kycSteps.length * 800));
    return () => timers.forEach(clearTimeout);
  }, [animate]);

  return (
    <div className="mx-2 glass-card-strong rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-border/30 flex items-center gap-2">
        <Shield size={12} className="text-silver" />
        <span className="text-[10px] font-mono text-silver">KYC Verification</span>
        <Landmark size={9} className="text-muted-foreground/30 ml-auto" />
      </div>
      <div className="p-3 space-y-2">
        {kycSteps.map((s, i) => {
          const isComplete = step > i;
          const isActive = step === i;
          const isWaiting = step < i;
          const Icon = s.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: isWaiting ? 0.3 : 1 }}
              animate={{ opacity: isWaiting ? 0.3 : 1 }}
              className={`flex items-center gap-3 py-2 px-2 rounded text-[11px] transition-all duration-300 ${
                isActive ? "bg-platinum/5 border border-platinum/10" : ""
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                isComplete ? "bg-platinum/10" : isActive ? "bg-foreground/10" : "bg-foreground/5"
              }`}>
                {isComplete ? (
                  <Check size={10} className="text-platinum" />
                ) : isActive ? (
                  <Loader2 size={10} className="text-silver animate-spin" />
                ) : (
                  <Icon size={10} className="text-muted-foreground/30" />
                )}
              </div>
              <div className="flex-1">
                <span className={isComplete ? "text-silver/50" : isActive ? "text-foreground" : "text-muted-foreground/40"}>
                  {s.label}
                </span>
              </div>
              <div className="text-right">
                {isComplete && (
                  <span className="text-[9px] text-platinum/60 font-mono">{s.value}</span>
                )}
                {isActive && (
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="text-[9px] text-muted-foreground/40 font-mono"
                  >
                    {s.statusText}
                  </motion.span>
                )}
              </div>
            </motion.div>
          );
        })}

        <div className={`rounded py-2 text-center text-[11px] font-medium transition-all duration-500 ${
          step >= kycSteps.length
            ? "bg-platinum/10 text-platinum border border-platinum/20"
            : "bg-foreground/5 text-muted-foreground/40 border border-border/20"
        }`}>
          {step >= kycSteps.length ? (
            <span className="flex items-center justify-center gap-1">
              <Check size={12} /> Identity Verified
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1">
              <Shield size={10} /> Verifying identity...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
const idUploadSteps = [
  { label: "Camera activated", icon: Camera },
  { label: "Document detected", icon: FileText },
  { label: "Extracting data (MRZ/OCR)", icon: Shield },
  { label: "Document captured", icon: Check },
];

const IDUploadCard = ({ animate }: { animate: boolean }) => {
  const [step, setStep] = useState(animate ? -1 : idUploadSteps.length);

  useEffect(() => {
    if (!animate) { setStep(idUploadSteps.length); return; }
    const timers: ReturnType<typeof setTimeout>[] = [];
    idUploadSteps.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i), 500 + i * 600));
    });
    timers.push(setTimeout(() => setStep(idUploadSteps.length), 500 + idUploadSteps.length * 600));
    return () => timers.forEach(clearTimeout);
  }, [animate]);

  return (
    <div className="mx-2 glass-card-strong rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-border/30 flex items-center gap-2">
        <Camera size={12} className="text-silver" />
        <span className="text-[10px] font-mono text-silver">Document Capture</span>
        <FileText size={9} className="text-muted-foreground/30 ml-auto" />
      </div>
      <div className="p-3 space-y-1.5">
        {/* Simulated camera viewfinder */}
        <div className="relative rounded-md bg-foreground/5 border border-border/20 h-20 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-2 border border-dashed border-platinum/20 rounded" />
          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-3 border-2 border-platinum/30 rounded flex items-center justify-center"
            >
              <div className="text-[9px] font-mono text-platinum/60 space-y-0.5 text-center">
                <div>PASSPORT ••••7291</div>
                <div className="text-[8px] text-muted-foreground/40">MRZ DATA EXTRACTED</div>
              </div>
            </motion.div>
          )}
          {step < 1 && (
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[9px] font-mono text-muted-foreground/40"
            >
              Align document in frame...
            </motion.div>
          )}
        </div>

        {/* Steps */}
        {idUploadSteps.map((s, i) => {
          const isComplete = step > i;
          const isActive = step === i;
          if (step < i) return null;
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-[10px] font-mono py-1"
            >
              {isComplete ? (
                <Check size={10} className="text-platinum/60 shrink-0" />
              ) : isActive ? (
                <Loader2 size={10} className="text-silver/40 animate-spin shrink-0" />
              ) : (
                <Icon size={10} className="text-muted-foreground/30 shrink-0" />
              )}
              <span className={isComplete ? "text-silver/50" : "text-foreground/70"}>{s.label}</span>
            </motion.div>
          );
        })}

        {/* Status bar */}
        <div className={`rounded py-1.5 text-center text-[10px] font-medium transition-all duration-500 mt-1 ${
          step >= idUploadSteps.length
            ? "bg-platinum/10 text-platinum border border-platinum/20"
            : "bg-foreground/5 text-muted-foreground/40 border border-border/20"
        }`}>
          {step >= idUploadSteps.length ? (
            <span className="flex items-center justify-center gap-1">
              <Check size={10} /> Document saved
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1">
              <Camera size={9} /> Capturing...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};


const QRCard = ({ value, label }: { value: string; label: string }) => (
  <div className="mx-2 glass-card-strong rounded-lg p-4 text-center space-y-2">
    <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-platinum">
      <Wifi size={12} /> eSIM Ready — Scan to Install
    </div>
    <div className="w-32 h-32 mx-auto rounded-lg bg-white p-2">
      <QRCodeSVG value={value} size={112} bgColor="#ffffff" fgColor="#000000" level="M" includeMargin={false} />
    </div>
    <p className="text-[10px] text-muted-foreground font-mono">{label}</p>
  </div>
);

const BoardingCard = ({ info }: { info?: BoardingInfo }) => {
  if (!info) return null;
  return (
    <div className="mx-2 glass-card-strong rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane size={12} className="text-platinum" />
          <span className="text-[10px] font-mono text-platinum">Boarding Pass</span>
        </div>
        <span className="text-[9px] font-mono text-muted-foreground/40">{info.airline}</span>
      </div>

      <div className="p-3 space-y-3">
        {/* Passenger & class */}
        <div className="flex justify-between items-center">
          <div>
            <div className="text-[9px] text-muted-foreground/40 font-mono">PASSENGER</div>
            <div className="text-[11px] text-foreground font-medium">{info.passenger}</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-muted-foreground/40 font-mono">CLASS</div>
            <div className="text-[11px] text-platinum font-medium">{info.class}</div>
          </div>
        </div>

        {/* Route */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-lg font-bold text-foreground tracking-wider">{info.from}</div>
            <div className="text-[9px] text-muted-foreground/50 truncate">{info.fromCity}</div>
          </div>
          <div className="flex flex-col items-center gap-0.5 px-2">
            <Plane size={14} className="text-platinum rotate-90" />
            <div className="text-[8px] text-muted-foreground/30 font-mono">{info.flight}</div>
          </div>
          <div className="flex-1 text-right">
            <div className="text-lg font-bold text-foreground tracking-wider">{info.to}</div>
            <div className="text-[9px] text-muted-foreground/50 truncate">{info.toCity}</div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-4 gap-2 py-2 border-t border-b border-border/20">
          <div>
            <div className="text-[8px] text-muted-foreground/40 font-mono">DATE</div>
            <div className="text-[10px] text-foreground font-medium">{info.date}</div>
          </div>
          <div>
            <div className="text-[8px] text-muted-foreground/40 font-mono">GATE</div>
            <div className="text-[10px] text-foreground font-medium">{info.gate}</div>
          </div>
          <div>
            <div className="text-[8px] text-muted-foreground/40 font-mono">BOARDING</div>
            <div className="text-[10px] text-foreground font-medium">{info.boarding}</div>
          </div>
          <div>
            <div className="text-[8px] text-muted-foreground/40 font-mono">SEAT</div>
            <div className="text-[10px] text-platinum font-bold">{info.seat}</div>
          </div>
        </div>

        {/* Times */}
        <div className="flex justify-between text-[10px]">
          <div><span className="text-muted-foreground/40">DEP </span><span className="text-foreground">{info.dep}</span></div>
          <div><span className="text-muted-foreground/40">ARR </span><span className="text-foreground">{info.arr}</span></div>
        </div>

        {/* PDF417-style barcode */}
        <div className="h-12 bg-foreground/5 rounded px-3 py-1.5 flex items-center overflow-hidden">
          <div className="flex items-center h-full w-full gap-[0.5px]">
            {/* Generate a deterministic PDF417-like pattern using flight info */}
            {(() => {
              const seed = `${info.flight}${info.seat}${info.passenger}`;
              const bars: { w: number; filled: boolean }[] = [];
              let hash = 0;
              for (let i = 0; i < seed.length; i++) {
                hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
              }
              // Start/stop patterns
              const startPattern = [3, 1, 1, 1, 2, 1, 1, 2];
              const stopPattern = [2, 1, 1, 2, 1, 1, 3, 1];
              // Build bars
              startPattern.forEach((w, i) => bars.push({ w, filled: i % 2 === 0 }));
              for (let i = 0; i < 60; i++) {
                hash = ((hash * 16807) + 1) & 0x7fffffff;
                const w = (hash % 3) + 1;
                bars.push({ w, filled: i % 2 === 0 });
              }
              stopPattern.forEach((w, i) => bars.push({ w, filled: i % 2 === 0 }));
              return bars.map((bar, i) => (
                <div
                  key={i}
                  className={bar.filled ? "bg-platinum/50" : "bg-transparent"}
                  style={{ width: `${bar.w}px`, height: "100%", flexShrink: 0 }}
                />
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

const HotelConfirmCard = ({ info }: { info: Record<string, string> }) => (
  <div className="mx-2 glass-card-strong rounded-lg overflow-hidden">
    <div className="px-3 py-2 border-b border-border/30 flex items-center gap-2">
      <Building size={12} className="text-platinum" />
      <span className="text-[10px] font-mono text-platinum">Reservation Confirmed</span>
    </div>
    <div className="p-3 space-y-1 text-[11px]">
      <div className="flex justify-between"><span className="text-muted-foreground">Booking No.</span><span className="text-platinum font-mono font-bold">{info.conf}</span></div>
      <div className="flex justify-between"><span className="text-muted-foreground">Check-in</span><span className="text-foreground">{info.checkin}</span></div>
      <div className="flex justify-between"><span className="text-muted-foreground">Check-out</span><span className="text-foreground">{info.checkout}</span></div>
      <div className="flex justify-between"><span className="text-muted-foreground">Room</span><span className="text-foreground">{info.room}</span></div>
    </div>
  </div>
);

const OrderConfirmCard = ({ info }: { info: Record<string, string> }) => (
  <div className="mx-2 glass-card-strong rounded-lg overflow-hidden">
    <div className="px-3 py-2 border-b border-border/30 flex items-center gap-2">
      <ShoppingBag size={12} className="text-platinum" />
      <span className="text-[10px] font-mono text-platinum">Order Confirmed</span>
    </div>
    <div className="p-3 space-y-1 text-[11px]">
      <div className="flex justify-between"><span className="text-muted-foreground">Item</span><span className="text-foreground">{info.item}</span></div>
      <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-foreground">{info.delivery}</span></div>
      <div className="flex justify-between pt-1 border-t border-border/20"><span className="text-muted-foreground">Tracking</span><span className="text-platinum font-mono">{info.tracking}</span></div>
    </div>
  </div>
);

const WalletConfirmCard = ({ info }: { info: Record<string, string> }) => (
  <div className="mx-2 glass-card-strong rounded-lg overflow-hidden">
    <div className="px-3 py-2 border-b border-border/30 flex items-center gap-2">
      <Wallet size={12} className="text-platinum" />
      <span className="text-[10px] font-mono text-platinum">Transaction Confirmed</span>
    </div>
    <div className="p-3 space-y-1 text-[11px]">
      {info.action && <div className="flex justify-between"><span className="text-muted-foreground">Action</span><span className="text-platinum font-medium">{info.action}</span></div>}
      {info.amount && <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="text-foreground">{info.amount}</span></div>}
      {info.from && info.to && <div className="flex justify-between"><span className="text-muted-foreground">Route</span><span className="text-foreground">{info.from} → {info.to}</span></div>}
      {info.cost && <div className="flex justify-between"><span className="text-muted-foreground">Cost</span><span className="text-foreground">{info.cost}</span></div>}
      {info.received && <div className="flex justify-between"><span className="text-muted-foreground">Received</span><span className="text-foreground">{info.received}</span></div>}
      {info.protocol && <div className="flex justify-between"><span className="text-muted-foreground">Protocol</span><span className="text-foreground">{info.protocol}</span></div>}
      {info.apy && <div className="flex justify-between"><span className="text-muted-foreground">APY</span><span className="text-platinum font-mono">{info.apy}</span></div>}
      {info.network && <div className="flex justify-between"><span className="text-muted-foreground">Network</span><span className="text-foreground">{info.network}</span></div>}
      {info.fee && <div className="flex justify-between"><span className="text-muted-foreground">Fee</span><span className="text-foreground">{info.fee}</span></div>}
      <div className="flex justify-between pt-1 border-t border-border/20"><span className="text-muted-foreground">Tx Hash</span><span className="text-platinum font-mono">{info.txHash}</span></div>
    </div>
  </div>
);

const PlanConfirmCard = ({ info }: { info: Record<string, string> }) => (
  <div className="mx-2 glass-card-strong rounded-lg overflow-hidden">
    <div className="px-3 py-2 border-b border-border/30 flex items-center gap-2">
      <Smartphone size={12} className="text-platinum" />
      <span className="text-[10px] font-mono text-platinum">Plan Activated</span>
    </div>
    <div className="p-3 space-y-1 text-[11px]">
      {info.plan && <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span className="text-foreground">{info.plan}</span></div>}
      {info.device && <div className="flex justify-between"><span className="text-muted-foreground">Device</span><span className="text-foreground">{info.device}</span></div>}
      {info.lines && <div className="flex justify-between"><span className="text-muted-foreground">Lines</span><span className="text-foreground">{info.lines}</span></div>}
      {info.billing && <div className="flex justify-between"><span className="text-muted-foreground">Billing</span><span className="text-platinum font-mono">{info.billing}</span></div>}
      {info.activation && <div className="flex justify-between"><span className="text-muted-foreground">Activation</span><span className="text-foreground">{info.activation}</span></div>}
      {info.shipping && <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-foreground">{info.shipping}</span></div>}
      {info.extras && <div className="flex justify-between pt-1 border-t border-border/20"><span className="text-muted-foreground">Extras</span><span className="text-platinum">{info.extras}</span></div>}
    </div>
  </div>
);

const BankConfirmCard = ({ info }: { info: Record<string, string> }) => (
  <div className="mx-2 glass-card-strong rounded-lg overflow-hidden">
    <div className="px-3 py-2 border-b border-border/30 flex items-center gap-2">
      <Landmark size={12} className="text-platinum" />
      <span className="text-[10px] font-mono text-platinum">Account Confirmed</span>
    </div>
    <div className="p-3 space-y-1 text-[11px]">
      {info.type && <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="text-foreground">{info.type}</span></div>}
      {info.bank && <div className="flex justify-between"><span className="text-muted-foreground">Bank</span><span className="text-foreground">{info.bank}</span></div>}
      {info.accountNo && <div className="flex justify-between"><span className="text-muted-foreground">Account No.</span><span className="text-platinum font-mono">{info.accountNo}</span></div>}
      {info.sortCode && <div className="flex justify-between"><span className="text-muted-foreground">Sort Code</span><span className="text-platinum font-mono">{info.sortCode}</span></div>}
      {info.iban && <div className="flex justify-between"><span className="text-muted-foreground">IBAN</span><span className="text-platinum font-mono text-[9px]">{info.iban}</span></div>}
      {info.applicationRef && <div className="flex justify-between"><span className="text-muted-foreground">Reference</span><span className="text-platinum font-mono">{info.applicationRef}</span></div>}
      {info.transferRef && <div className="flex justify-between"><span className="text-muted-foreground">Transfer Ref</span><span className="text-platinum font-mono">{info.transferRef}</span></div>}
      {info.amount && <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="text-foreground">{info.amount}</span></div>}
      {info.fee && <div className="flex justify-between"><span className="text-muted-foreground">Fee</span><span className="text-foreground">{info.fee}</span></div>}
      {info.goldBalance && <div className="flex justify-between"><span className="text-muted-foreground">Gold Balance</span><span className="text-platinum font-mono">{info.goldBalance}</span></div>}
      {info.beneficiary && <div className="flex justify-between"><span className="text-muted-foreground">Beneficiary</span><span className="text-foreground">{info.beneficiary}</span></div>}
      {info.profitRate && info.profitRate !== "N/A" && <div className="flex justify-between"><span className="text-muted-foreground">Profit Rate</span><span className="text-platinum font-mono">{info.profitRate}</span></div>}
      {info.term && <div className="flex justify-between"><span className="text-muted-foreground">Term</span><span className="text-foreground">{info.term}</span></div>}
      {info.status && <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="text-foreground">{info.status}</span></div>}
      {info.access && <div className="flex justify-between"><span className="text-muted-foreground">Access</span><span className="text-foreground">{info.access}</span></div>}
      {info.extras && <div className="flex justify-between"><span className="text-muted-foreground">Extras</span><span className="text-foreground">{info.extras}</span></div>}
      {info.sharia && <div className="flex justify-between pt-1 border-t border-border/20"><span className="text-muted-foreground">Certification</span><span className="text-platinum font-mono">{info.sharia}</span></div>}
    </div>
  </div>
);

const StockConfirmCard = ({ info }: { info: Record<string, string> }) => (
  <div className="mx-2 glass-card-strong rounded-lg overflow-hidden">
    <div className="px-3 py-2 border-b border-border/30 flex items-center gap-2">
      <TrendingUp size={12} className="text-platinum" />
      <span className="text-[10px] font-mono text-platinum">Trade Confirmed</span>
    </div>
    <div className="p-3 space-y-1 text-[11px]">
      {info.portfolio && <div className="flex justify-between"><span className="text-muted-foreground">Portfolio</span><span className="text-foreground">{info.portfolio}</span></div>}
      {info.stocks && <div className="flex justify-between"><span className="text-muted-foreground">Stocks</span><span className="text-foreground">{info.stocks}</span></div>}
      {info.amount && <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="text-platinum font-mono">{info.amount}</span></div>}
      {info.status && <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="text-foreground">{info.status}</span></div>}
      {info.screening && <div className="flex justify-between pt-1 border-t border-border/20"><span className="text-muted-foreground">Sharia Screening</span><span className="text-platinum font-mono">{info.screening}</span></div>}
    </div>
  </div>
);

export default AnvarChatDemo;
