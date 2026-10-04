"use client";

import { Truck, CreditCard, ShieldCheck, Headphones } from "lucide-react";
import { useLanguageStore } from "@/store/language";

export function TrustFeatures() {
  const { t } = useLanguageStore();

  const features = [
    {
      icon: Truck,
      title: t.trust.deliveryTitle,
      desc: t.trust.deliveryDesc,
    },
    {
      icon: CreditCard,
      title: t.trust.paymentTitle,
      desc: t.trust.paymentDesc,
    },
    {
      icon: ShieldCheck,
      title: t.trust.authenticTitle,
      desc: t.trust.authenticDesc,
    },
    {
      icon: Headphones,
      title: t.trust.supportTitle,
      desc: t.trust.supportDesc,
    },
  ];

  return (
    <section className="py-6 bg-white border-y border-[#F7E1E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#FCF6F7] border border-[#F6D5DC] hover:border-[#5C1429]/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#5C1429] shadow-2xs shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
