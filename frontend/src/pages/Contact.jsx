import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, HelpCircle, LogIn, MessageCircleQuestion } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const issueTypes = [
  "Help with your issues",
  "Help with your order",
  "Help with account and security",
  "Help with payments",
  "Help with returns and refunds",
  "Help with delivery",
];

const helpTopics = [
  "Delivery related",
  "Login and my account",
  "Refunds related",
  "Payment",
  "Returns & pickup related",
  "Cancellation related",
];

const faqByTopic = {
  "Delivery related": [
    {
      q: "Where is my order currently?",
      a: "Track your shipment status from the Orders section. You will also receive shipping updates by email and SMS.",
    },
    {
      q: "What if my delivery is delayed?",
      a: "If a package misses the expected date, we automatically investigate with the courier and update your revised timeline.",
    },
    {
      q: "Can I change my delivery address?",
      a: "Address can be updated before dispatch. After dispatch, contact support and we will request rerouting where possible.",
    },
  ],
  "Login and my account": [
    {
      q: "I cannot log in to my account.",
      a: "Use Forgot Password on login. If the issue continues, contact support with your registered email and phone number.",
    },
    {
      q: "How do I update profile details?",
      a: "Open Profile and edit your name, phone, and saved addresses. Changes are applied instantly.",
    },
    {
      q: "How can I secure my account?",
      a: "Use a strong password, avoid sharing OTPs, and sign out on shared devices.",
    },
  ],
  "Refunds related": [
    {
      q: "When will my refund be processed?",
      a: "Refunds are initiated after return verification and usually reflect in 3-7 business days.",
    },
    {
      q: "Will shipping charges be refunded?",
      a: "Shipping charges are refunded only for incorrect, damaged, or incomplete deliveries.",
    },
  ],
  Payment: [
    {
      q: "Why did payment fail but amount got debited?",
      a: "Most failed-payment reversals are automatic and reflect within 24-72 hours depending on your bank.",
    },
    {
      q: "Which payment methods are supported?",
      a: "We support UPI, cards, net banking, selected wallets, and COD where available.",
    },
  ],
  "Returns & pickup related": [
    {
      q: "How do I request a return?",
      a: "Go to Orders, choose the item, and select Return. Pickup availability is shown by pincode.",
    },
    {
      q: "What conditions apply for returns?",
      a: "Products should be unused, in original packaging, and within the return window listed on product details.",
    },
  ],
  "Cancellation related": [
    {
      q: "Can I cancel an order anytime?",
      a: "Orders can be cancelled before dispatch. Once shipped, cancellation is disabled and return flow applies.",
    },
    {
      q: "Will I get full refund on cancellation?",
      a: "Yes, eligible prepaid cancellations receive full refund to the original payment method.",
    },
  ],
};

function Contact() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState("Delivery related");
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = useMemo(() => faqByTopic[selectedTopic] || [], [selectedTopic]);

  return (
    <div className="min-h-screen bg-[#fff7ee] text-[#2b2018]">
      <Navbar />

      <main className="mx-auto grid max-w-[1400px] gap-4 px-4 pb-10 pt-24 lg:grid-cols-[360px_1fr]">
        <aside className="max-h-[82vh] overflow-y-auto rounded border border-[#edd8bc] bg-white">
          <section className="border-b border-[#f0e3d3] px-6 py-5">
            <p className="text-xs font-bold tracking-wide text-[#7a522f] uppercase">Type of issue</p>
            <ul className="mt-4 space-y-2 text-[#1f2d3a]">
              {issueTypes.map((item) => (
                <li key={item} className="rounded px-3 py-2 text-[#2b2018] hover:bg-[#fbf1e3]">{item}</li>
              ))}
            </ul>
          </section>
        </aside>

        <section className="space-y-4">
          <div className="rounded border border-[#edd8bc] bg-white">
            <div className="border-b border-[#f0e3d3] px-6 py-4 text-[#8a6038]">Help Centre</div>
            <div className="px-6 py-6">
              <div className="flex items-center justify-between rounded-2xl bg-[#f9efe2] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f3d9b4] text-[#8a6038]">
                    <HelpCircle size={16} />
                  </span>
                  <div>
                    <p className="text-xl font-semibold text-[#2b2018]">Support updates</p>
                    <p className="text-[#6e5947]">Quick answers for all your common queries</p>
                  </div>
                </div>
                <button className="inline-flex items-center gap-1 text-sm font-semibold text-[#8a6038] transition hover:text-[#7a522f]">
                  Know more <ChevronRight size={16} />
                </button>
              </div>

              <div className="mt-10 grid gap-4 lg:grid-cols-[280px_1fr] lg:items-start">
                <div className="rounded-2xl border border-[#edd8bc] bg-[#fffaf4] p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#7a522f]">Help topics</p>
                  <ul className="mt-4 space-y-2">
                    {helpTopics.map((topic) => (
                      <li key={topic}>
                        <button
                          onClick={() => {
                            setSelectedTopic(topic);
                            setOpenFaq(0);
                          }}
                          className={`w-full rounded px-3 py-3 text-left text-base transition ${
                            selectedTopic === topic ? "bg-[#f3e6d3] text-[#8a6038]" : "text-[#2b2018] hover:bg-[#fbf1e3]"
                          }`}
                        >
                          {topic}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-[#edd8bc] bg-white">
                  <div className="px-6 py-5">
                    <h2 className="text-4xl font-semibold text-[#2b2018]">What issue are you facing?</h2>
                    <p className="mt-2 text-lg text-[#8a6038]">{selectedTopic}</p>
                  </div>
                  <div className="border-t border-[#f0e3d3]">
                    {faqs.map((item, index) => {
                      const isOpen = openFaq === index;
                      return (
                        <article key={item.q} className="border-b border-[#f0e3d3] last:border-b-0">
                          <button
                            onClick={() => setOpenFaq(isOpen ? -1 : index)}
                            className="flex w-full items-center justify-between px-6 py-5 text-left"
                          >
                            <div>
                              <p className="text-xl text-[#2b2018]">{item.q}</p>
                              {!isOpen ? <p className="mt-1 text-sm text-[#8a775f]">Tap to view answer</p> : null}
                            </div>
                            <ChevronRight className={`text-[#8a6038] transition ${isOpen ? "rotate-90" : ""}`} size={18} />
                          </button>
                          {isOpen ? <p className="px-6 pb-5 text-base leading-7 text-[#6e5947]">{item.a}</p> : null}
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-dashed border-[#e6cdb0] bg-[#fffaf4] px-6 py-10 text-center">
                <MessageCircleQuestion className="mx-auto text-[#c4a27c]" size={72} strokeWidth={1.5} />
                <p className="mt-5 text-3xl text-[#2b2018]">Need faster help?</p>
                <p className="mt-3 text-lg text-[#6e5947]">
                  Login to get help with your recent orders and account related issues.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="mx-auto mt-6 inline-flex items-center gap-2 rounded bg-[#8a6038] px-10 py-3 text-lg font-semibold text-white transition hover:bg-[#7a522f]"
                >
                  <LogIn size={18} />
                  Log in
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Contact;
