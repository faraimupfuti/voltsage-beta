'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const ARTICLES = [
  {
    title: 'Why Do Solar Quotes Vary So Much for the Same House?',
    tag: 'Buying smart',
    body: `"I got three quotations for my house, and every installer recommended a different system. Which one is right?"

If you've ever requested multiple solar quotations, you've probably experienced this. One company recommends a 5 kW inverter, another suggests 8 kW, and a third insists you need 10 kW. Battery sizes differ, the number of solar panels varies, and before long you're left wondering whether anyone really knows what your house needs.

The truth is, there isn't always one "correct" answer. But there should always be a good reason behind the recommendation.

The first reason quotations can differ is straightforward: not every supplier works with the same equipment. One installer may recommend one inverter brand because of its performance or warranty, while another may use a different manufacturer because that's what they stock or are familiar with. Different brands also have different features, efficiencies, and pricing, all of which influence the final quotation.

The more important reason, however, lies in how the system is sized.

A solar system shouldn't be designed simply because a house has three bedrooms or because last month's electricity bill was a certain amount. It should be designed around the way electricity is actually used.

Think about two houses on the same street. They might look almost identical from the outside, yet their energy needs could be completely different. One family may be home throughout the day, while the other leaves for work every morning and returns in the evening. One home may have a borehole pump, two refrigerators, and an electric gate, while another has none of these. One family may only want to keep the essentials running during a power outage, while another expects the entire house to operate exactly as it does when the grid is available.

On paper, both houses might consume a similar amount of electricity each month. In reality, they may require very different solar systems.

This is why a proper load assessment is so important. A good design isn't based only on how much electricity you use. It's also based on when you use it, which appliances operate together, and whether those appliances have motors or compressors that create starting surges.

Without this information, there is a risk of recommending a system that is larger than necessary — increasing the project's cost — or smaller than required, resulting in poor performance and frequent overloads.

This is also why we believe that understanding your energy needs shouldn't be left entirely to engineers or installers. You don't need to know how to design a solar system, but you should understand how you use electricity. Which appliances are essential? Which ones run at the same time? Do you really need battery backup for the whole house, or only for certain circuits? The better you understand your own energy habits, the better equipped you'll be to evaluate different quotations and ask the right questions.

That's the thinking behind VoltSage. We believe that good energy decisions start with good information. Our sizing tools and educational resources are designed to help you understand your unique energy requirements before comparing equipment or requesting quotations.

Whether you're planning a system for a home, farm, office, school, or business, the same principle applies: every site is different because every user is different. The best solar system isn't necessarily the biggest, the cheapest, or the one with the most panels. It's the one that's been engineered around the way you use energy.`,
  },
  {
    title: 'Why Does the VoltSage Sizing Tool Consider Surge Demand?',
    tag: 'Solar basics',
    body: `Did You Know?

A refrigerator that consumes only 150 W while running can briefly require 450–900 W when its compressor starts. This momentary increase in power, known as surge demand, is one of the most common reasons why undersized inverters trip, overload, or shut down.

The same principle applies to other appliances that contain motors or compressors, including refrigerators and freezers, borehole and pressure pumps, compressors and power tools.

This is why inverter sizing is not just about matching the running load. To ensure reliability, the inverter must also be able to handle short surge events without tripping when motors or compressors start. There are two quick ways an inverter can be sized:

Method 1 – Select an Inverter Based on Continuous Power

A common approach is to select an inverter with a continuous power rating equal to or greater than the calculated peak running demand.

Example:
— Peak running demand: 3.0 kW
— Maximum surge demand: 4.5 kW

Using this method alone, a 3 kW inverter would appear to be sufficient. However, if its surge capability is less than 4.5 kW, it may trip each time a motor starts.

Method 2 – Consider the Inverter's Surge Capability (Highly Recommended)

A more economical approach is to select the smallest inverter whose continuous power rating meets the running demand and whose surge withstand rating exceeds the calculated surge demand.

Example:
— Peak running demand: 3.0 kW
— Maximum surge demand: 4.5 kW

Instead of purchasing a much larger inverter simply to accommodate motor starting, you could choose an inverter with:
— Continuous output rating: 5 kW
— Surge capability: 10 kW for 10 seconds

This inverter comfortably supplies the 3 kW running load while also accommodating the 4.5 kW motor starting demand, providing a more cost-effective solution without compromising reliability.

Some modern inverters specify a surge withstand — sometimes termed Peak Power — that is up to 2 times the rated power for a limited period, such as 10 seconds. For example, a 5 kW inverter may be able to supply 10 kW briefly, while an 8 kW inverter may be able to supply 16 kW for a short duration. This allows the inverter to start motor-driven appliances without being continuously oversized. Always check the manufacturer's datasheet to confirm the continuous rating and surge duration before making a selection.

At VoltSage, we don't simply recommend a larger inverter because an appliance has a high starting current. Instead, we evaluate both the continuous running demand and the temporary surge demand to recommend an inverter that is technically suitable and economically optimised. This approach reduces unnecessary equipment costs while ensuring the system can reliably start motor-driven appliances when they are needed.`,
  },
  {
    title: 'kW vs kVA — What\'s the Difference?',
    tag: 'Solar basics',
    body: `If you've been comparing solar inverters, you've probably noticed that some are advertised as 5 kW, 8 kW, or 12 kW, while others are rated as 5 kVA, 10 kVA, or even 15 kVA. So, what do these ratings mean, and does it matter?

The short answer is yes — understanding the difference can help you select the right inverter and compare products more accurately.

Understanding the terms

kW (kilowatts) is the real power consumed by your appliances to perform useful work. This is the power that produces heat, light, cooling, pumping, or motion.

kVA (kilovolt-amperes) is the apparent power, which represents the total electrical power supplied by the inverter. Apparent power includes both the useful power (kW) and the reactive power required by certain electrical equipment, particularly motors and inductive loads.

The relationship between the two is:
kW = kVA × Power Factor (PF)

The Power Factor (PF) indicates how efficiently electrical power is converted into useful work. For purely resistive loads, such as kettles and electric heaters, the power factor is close to 1.0. Motor-driven equipment, such as pumps and air conditioners, typically has a lower power factor.

Example

Consider an inverter rated at 5 kVA with a power factor of 0.8. Its maximum continuous real power output is:
5 kVA × 0.8 = 4 kW

Although the inverter is labelled 5 kVA, it can continuously supply only 4 kW of useful power.

Now consider another inverter rated at 5 kW with a power factor of 1.0. This inverter can deliver the full 5 kW of real power continuously.

Both inverters may appear similar in size, but their usable output is different.

Why are some inverters rated in kVA and others in kW?

Traditionally, many inverters, generators, transformers, and UPS systems have been specified in kVA because they are designed to supply a wide range of loads with varying power factors.

Many modern hybrid solar inverters, however, are designed with a power factor of 1.0, allowing manufacturers to specify them directly in kW. This makes it easier for users to compare the inverter's rating with the power demand of their appliances.

Which rating should you use?

For most residential and small commercial solar systems, it is often more practical to think in kW, as appliance ratings are typically expressed in watts or kilowatts. If an inverter is specified in kVA, always check its rated power factor to determine the equivalent continuous output in kW.

The VoltSage Tip: When comparing two inverters, don't rely solely on the number displayed on the front panel. Check the manufacturer's datasheet to confirm the continuous output rating (kW or kVA), the rated power factor (if specified in kVA), the maximum surge or overload capability, and the duration for which the surge power can be sustained.

Two inverters with the same headline rating may have very different performance characteristics. Understanding both kW and kVA helps you make informed decisions and select an inverter that matches your energy requirements.`,
  },
  {
    title: 'Understanding Battery Technologies',
    tag: 'Batteries',
    body: `"Which battery is the best?"

It's one of the first questions people ask when they're considering a solar system. Unfortunately, it's also one of the hardest questions to answer because there isn't a single battery that's best for everyone.

The better question is: "Which battery is best for the way I use energy?"

Just as every home, farm, office or business has different energy needs, different battery technologies have different strengths. Choosing the right one is about understanding those differences rather than simply buying the battery with the biggest capacity or the longest warranty.

What Does a Battery Actually Do?

A battery stores energy produced by your solar panels or supplied by the grid so that it can be used later. That might sound simple, but the way a battery is used can vary significantly. Some people only want a few hours of backup during a power outage. Others want to run completely off-grid. Some use most of their electricity during the day, while others need stored energy mainly in the evenings. The right battery depends on how it will be used.

The Main Battery Technologies

Today, most solar systems use one of two battery technologies: Lead-Acid or Lithium-ion, with Lithium Iron Phosphate (LiFePO₄) being the most common type of lithium battery in residential and commercial solar systems.

Lead-acid batteries have been around for decades and remain one of the most affordable ways to store electrical energy. They have a lower upfront cost, making them attractive where budget is the main concern. However, they are larger, heavier, require more maintenance in some cases, and generally have a shorter service life than modern lithium batteries. They also perform best when they are not discharged too deeply on a regular basis, which means not all of their stored energy should be used if you want to maximise their lifespan.

Lithium Iron Phosphate (LiFePO₄) batteries have become the preferred choice for most new solar installations. Although they cost more initially, they typically last much longer, can be discharged much deeper without significantly affecting their lifespan, require little maintenance, and are generally more efficient. Their compact size, faster charging capability and longer cycle life often make them the more economical option over the lifetime of the system.

So Why Are Lithium Batteries More Expensive?

At first glance, a lead-acid battery may seem like the obvious choice because it costs less. But comparing batteries based only on purchase price is a bit like comparing two vehicles based only on the cost of the fuel tank. A battery's real value comes from how much usable energy it can deliver over its lifetime.

For example, two batteries may both be labelled as 10 kWh, but if one can regularly use 90% of its stored energy while the other should only use about 50%, they provide very different amounts of usable energy in everyday operation. Add in differences in lifespan, charging efficiency and maintenance, and the battery with the lower purchase price may not necessarily be the less expensive option in the long run.

Bigger Isn't Always Better

It's easy to assume that buying the biggest battery available is the safest option. In reality, the right battery size depends on your energy requirements. A family that only wants to power lights, refrigeration and internet during load shedding has very different storage needs from a business that wants to operate throughout the night or a farm that relies on overnight pumping.

Choosing the correct battery is about matching storage capacity to your actual usage, not simply buying the largest battery your budget allows.

At VoltSage, we believe that battery selection should be driven by engineering, not marketing. Rather than asking, "Which battery is the best?" we encourage a different question: "What does my energy system actually need?"

When your battery is selected based on your unique energy requirements, you're far more likely to end up with a system that performs well, represents good value for money, and continues to meet your needs for years to come. The goal isn't simply to store energy — it's to store the right amount of energy, using the right technology, for the way you use it.`,
  },
  {
    title: 'Battery Capacity Explained: What Does 5 kWh or 10 kWh Actually Mean?',
    tag: 'Batteries',
    body: `"I'm looking at two batteries. One is 5 kWh and the other is 10 kWh. Does that mean the 10 kWh battery will power my house for 10 hours?"

Not quite.

One of the most common misconceptions about solar batteries is that the number printed on the battery tells you how long it will last. In reality, battery capacity tells you how much energy the battery can store — not how long it can power your home.

To understand why, imagine a battery as a water tank. The larger the tank, the more water it can hold. But how long that water lasts depends on how many taps are open and how much water is flowing through them. The same principle applies to a battery. A larger battery stores more energy, but how long it lasts depends on how much electricity your appliances are using.

So, What Does kWh Mean?

The term kWh (kilowatt-hour) is simply a measure of energy. It tells you how much electrical energy a battery can store.

For example:
— A 5 kWh battery stores approximately 5 kilowatt-hours of energy.
— A 10 kWh battery stores approximately 10 kilowatt-hours of energy.

Let's Look at an Example:

Suppose your essential household appliances consume a total of 500 W (0.5 kW). This could include a refrigerator, a few LED lights, a Wi-Fi router, a television, and phone charging.

Ignoring losses for a moment, a 5 kWh battery could theoretically supply those loads for:
5 kWh ÷ 0.5 kW = 10 hours

Now suppose you switch on additional appliances and your total demand increases to 2 kW. The same battery would now last approximately:
5 kWh ÷ 2 kW = 2.5 hours

The battery hasn't changed — only the amount of power being drawn from it.

But there's another important factor: in practice, you don't always have access to the battery's full rated capacity.

Depth of Discharge (DoD)

Most batteries are designed to operate within a recommended Depth of Discharge (DoD). Simply put, DoD describes how much of the stored energy can be used before the battery should be recharged.

For example, a 10 kWh battery with a recommended DoD of 90% provides approximately:
10 kWh × 90% = 9 kWh of usable energy

Similarly, a 5 kWh battery with a 90% DoD provides approximately 4.5 kWh of usable energy. This is one reason why two batteries with the same advertised capacity may not deliver the same amount of usable energy.

Efficiency Also Matters

Every time a battery is charged and discharged, a small amount of energy is lost as heat. Modern lithium batteries are typically around 95% efficient, meaning most of the stored energy is available for use, while a small portion is lost during the charging and discharging process.

For example, if a battery stores 9 kWh of usable energy and has a round-trip efficiency of 95%, the energy effectively available to your appliances is approximately:
9 kWh × 95% = 8.55 kWh

Although these losses are relatively small, they become important when accurately sizing a solar system.

So, How Long Will My Battery Last?

There isn't a single answer. The backup time depends on several factors: the battery's rated capacity (kWh), the recommended Depth of Discharge (DoD), the battery's efficiency, the total power being used by your appliances, and which appliances are operating at the same time.

This is why two homes with identical batteries can experience very different backup times.

At VoltSage, we believe that battery sizing should be based on usable energy, not just the number printed on the battery. Our Battery Runtime Tool considers how you use electricity, how long you expect your system to provide backup, and the characteristics of the battery technology itself. The best battery isn't simply the one with the highest capacity — it's the one that provides the right amount of usable energy for the way you use it.`,
  },
  {
    title: 'Solar Backup vs Generator Backup: Which One Is Right for You?',
    tag: 'Economics',
    body: `"The power is out again. Should I buy a generator, install solar, or consider both?"

This is a question many homeowners, business owners, farmers, and institutions are asking as electricity reliability becomes a bigger concern.

The truth is, there is no single solution that is perfect for everyone. A generator and a solar system solve the same problem — providing electricity when the grid is unavailable — but they approach the problem in different ways. Understanding the difference helps you choose a solution that matches your energy needs, budget, and expectations.

First, Understanding Solar Backup Systems

When people say they want "solar backup," they are usually referring to a system consisting of solar panels (which generate electricity from sunlight), batteries (which store energy for later use), and an inverter (which converts stored DC energy into usable AC electricity for appliances).

The inverter is the heart of the system because it manages how energy flows between the solar panels, batteries, grid, and appliances. There are different types of solar inverters available, but the two most common for backup applications are off-grid inverters and hybrid inverters.

Off-Grid Solar Systems

An off-grid inverter is designed for locations where there is no reliable electricity grid connection. The system relies entirely on solar generation and battery storage to supply energy. Because there is no grid backup, the system must be carefully designed to meet the site's energy requirements throughout the year.

This makes off-grid systems suitable for remote homes, rural facilities, farms located away from the grid, and areas where grid connection is unavailable. The challenge with off-grid systems is that the solar and battery capacity must be large enough to handle periods of low sunlight and increased energy demand.

Hybrid Solar Systems

Hybrid inverters have become one of the most popular choices for homes and businesses connected to the grid. Unlike off-grid systems, hybrid inverters can intelligently manage multiple energy sources: solar power, battery storage, grid electricity, and generator input (available on many inverter models).

During normal operation, solar energy can power appliances and charge the batteries. When solar energy is unavailable, the battery can supply power. If the battery becomes depleted, the system can switch to grid or generator power. This flexibility makes hybrid systems suitable for many residential, agricultural, and commercial applications.

The Advantages of Solar Backup

One of the biggest advantages of solar is that it can do more than provide backup power. A generator typically sits idle until there is an outage. Solar panels, however, can produce electricity every day and reduce dependence on the grid. The benefits include lower electricity costs over time, no fuel requirement during normal operation, quiet operation, reduced emissions, and less dependence on an unreliable grid.

For many users, solar becomes the primary energy source, while batteries provide backup when needed. For example, a business can use solar energy during working hours, reducing electricity costs, while the battery supports critical loads during outages.

Where Generators Still Have an Advantage

Generators remain a reliable and practical backup solution. Their biggest advantage is energy availability. As long as fuel is available, a generator can continue supplying power regardless of weather conditions, time of day, or battery capacity.

This makes generators particularly useful for large facilities with high energy demand, long-duration outages, and critical operations where extended backup is required. For example, a farm running irrigation pumps during a multi-day outage may require a generator to provide continuous high-power operation.

However, generators also have ongoing operating costs: fuel, servicing, oil changes, maintenance, noise, and exhaust emissions. A generator provides reliable backup, but every hour it runs has a cost.

The Hybrid Approach: Solar + Battery + Generator

For many applications, the best solution is not choosing between solar and a generator — it is combining them. A hybrid energy system can use solar as the primary energy source, batteries for short-term backup, and a generator for extended outages or high-demand periods.

During the day, solar powers appliances and excess solar charges the batteries. During the evening, batteries provide power to essential loads. During a prolonged outage, the generator only starts when additional energy is required. This reduces fuel consumption, generator runtime, and maintenance while improving overall reliability.

So, Which Backup Solution Should You Choose?

The answer depends on what you need the system to achieve.

If you only need occasional emergency backup, a generator may be the simplest and most affordable option. If you want to reduce electricity costs while also having backup, a solar and battery system may be the better long-term investment. If you require maximum reliability, a hybrid solution combining solar, batteries, and a generator may provide the best balance.

Energy decisions should start with understanding your requirements, not selecting equipment first. The right backup solution depends on questions such as: What appliances must remain powered during an outage? How long do outages typically last? Are there motors, pumps, or other high-demand equipment? Is the goal backup power, energy savings, or energy independence?

Every home, farm, school, and business uses energy differently. The best energy solution is not necessarily the one with the biggest battery, the largest generator, or the most solar panels. It is the solution that has been designed around the way you use energy.`,
  },
]

export default function ArticlesSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="articles" className="py-24"
      style={{ background: 'linear-gradient(180deg,#050709 0%,#0d1117 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="max-w-2xl mb-12">
          <div className="section-eyebrow">VoltSage Learn</div>
          <h2 className="font-disp font-extrabold text-4xl sm:text-5xl text-white uppercase leading-tight mb-4">
            Read before you<br />
            <span className="brand-text">talk to any installer</span>
          </h2>
          <p className="text-slate-400 text-base">
            Six articles written to help you understand solar energy — in plain language,
            in the right order, before you request a single quotation.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {ARTICLES.map((a, i) => (
            <div
              key={i}
              className={`glass rounded-2xl overflow-hidden border transition-all duration-300 ${
                open === i ? 'border-brand-teal/30' : 'border-white/5 hover:border-white/10'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span
                    className="flex-shrink-0 px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest border whitespace-nowrap"
                    style={{
                      borderColor: 'rgba(6,182,212,0.3)',
                      color: '#06b6d4',
                      background: 'rgba(6,182,212,0.08)',
                    }}
                  >
                    {a.tag}
                  </span>
                  <h3 className="font-disp font-bold text-lg text-white uppercase group-hover:text-brand-teal transition-colors leading-tight">
                    {a.title}
                  </h3>
                </div>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 text-slate-500 transition-transform duration-300 ${
                    open === i ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  open === i ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <div className="h-px bg-white/5 mb-5" />
                  {a.body.split('\n\n').map((para, j) => (
                    <p
                      key={j}
                      className="text-slate-400 text-sm leading-relaxed mb-4 last:mb-0 whitespace-pre-line"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
