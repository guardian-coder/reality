# Reviewer A â€” Independent Dependency-Model Report

Produced by an isolated general-purpose agent with no access to this project's evaluator code, contract schema, CLAUDE.md, or COLLABORATION.md â€” only the raw FHWA-HRT-09-040 excerpt (`2026-09-05_source_FHWA-HRT-09-040_excerpt.txt`) and the task prompt in `2026-09-05_INDEPENDENT_REVIEWER_COMPARISON.md`. Reproduced verbatim below.

---

# Independent Review: Shared-Dependency / Corroboration Analysis of the I-35W (St. Anthony Falls) Bridge Substructure Health Monitoring System

**Source used:** FHWA-HRT-09-040, Chapter 4 ("I-35W Bridge Foundation Monitoring"), with Chapter 3's tail section (the "voided shaft" test-specimen study) used only as background where the document itself cross-references it as the precedent for the same hardware (Campbell Scientific CR1000/AM25T/Raven100 stack). I flag every place I lean on Chapter 3 for context, since it describes a lab/field test specimen, not the deployed I-35W bridge itself.

**Scope note on the decision this evidence supports:** Per your framing, the system exists to help MnDOT/FHWA decide (a) whether to proceed to the next construction stage, and (b) later, whether in-service loads remain within safe bounds. Everything below is oriented toward that use: which "independent-looking" readings would actually rise or fall together if a component failed, and would therefore give false confidence if stacked together as corroboration.

---

## 1. Evidence sources and lineage

The document describes three parallel monitoring systems built up over three project phases (Phase I: thermal during shaft/footing curing; Phase II: construction load monitoring in shafts and columns; Phase III: long-term in-service monitoring). Each phase reuses and extends prior hardware. I list each distinct evidence source and trace its lineage from raw physical measurement to recorded/displayed value.

**Source A â€” Thermocouples (TCs) in drilled shafts.** 10 TCs per shaft at four gauge levels (GL1â€“GL4), plus 2 more inserted into the shaft center on a separate rebar after the concrete pour. Lineage: TC â†’ wire (bundled with strain-gauge wires from the same shaft) â†’ routed through a 1.5-inch PVC conduit from shaft to the on-site DAS box â†’ **AM25T 25-channel multiplexer** (needed because the CR1000 logger didn't have enough channels to read all TCs directly) â†’ **CR1000 data logger** (System 1) â†’ on-board storage every 15 min â†’ **Raven100 CDMA AirLink cellular modem** (System 1's dedicated modem) â†’ transmitted hourly â†’ **host computer at the USF Geotechnical Research Group** â†’ **LoggerNet** software (Campbell Scientific) plus the group's own analysis scripts â†’ auto-plotted to the **USF Geotechnical Research public website**.

**Source B â€” Thermocouples in the pier footing.** Same lineage as Source A, via a 2-inch PVC conduit instead of 1.5-inch, converging on the same AM25T/CR1000/modem/host chain (System 1).

**Source C â€” CC640 field camera.** Hourly photos. Lineage: camera â†’ stored locally to an internal compact-flash card â†’ also fed into **CR1000 (System 1)** â†’ same Raven100 modem as Sources A/B â†’ host computer â†’ website (with hover-point links tying photos to strain plots).

**Source D â€” Vibrating-wire (VW) strain gauges.** Geokon Model 4911 "sister bar" gauges: 16 per shaft (4 levels Ã— 4 gauges) in each of the two instrumented shafts, and 4 per column (one per corner) in each of two columns (interior, exterior). Lineage: gauge â†’ wire (bundled with the co-located RT gauge's wire and, in the columns, with University of Minnesota gauge wires) â†’ routed through 2-inch PVC conduit â†’ **one of four low-power MUX 16/32B multiplexers** (MUX1 = shaft 2, 16 gauges; MUX2 = shaft 1, 16 gauges; MUX3 = interior column, 10 gauges; MUX4 = exterior column, 10 gauges) â†’ **one of two AVW200 two-channel spectrum analyzers** â†’ **CR1000 data logger (System 2 â€” a physically separate CR1000 unit from System 1's, same model)** â†’ on-board storage every 15 min â†’ **System 2's own dedicated Raven100 CDMA modem** â†’ transmitted hourly â†’ same USF host computer/website.

**Source E â€” Thermistors integrated into the VW gauges.** Same physical gauge body as Source D, so identical lineage (MUX â†’ AVW200 â†’ CR1000/System 2 â†’ System 2's modem â†’ host). Notably, after the shaft TCs (Source A) were physically disconnected on January 21, 2008, this thermistor stream became the *sole* continuing source of shaft thermal data, spliced onto the earlier TC record.

**Source F â€” Resistance-type (RT) strain gauges.** Coupled 1:1 with the VW gauges at the same physical locations (8 per shaft, 4 per column). Lineage: gauge â†’ wire (bundled with the paired VW gauge's wire) â†’ **CR9000 data logger (System 3)**, sampling at 100 Hz with mean/max/min computed and stored every 15 min â†’ **System 3's own dedicated Raven100 CDMA modem** â†’ transmitted hourly â†’ same USF host computer/website.

**Source G â€” University of Minnesota's own column strain gauges** (5 per column, one more location than the FHWA gauges). Wires were "bundled with the wires from the FHWA gauges and pulled out to the DAS at the same time." The document explicitly states no analysis of these gauges is presented in this report, and it does **not specify** which logger, modem, or software processes this stream â€” whether it shares any FHWA/USF hardware downstream of the shared conduit pull, or diverges to an entirely separate University-operated DAS, is not stated.

**Source H â€” MnDOT's "west camera" web feed**, mentioned only in passing as a separate video linked from the same website's hover points. The document gives essentially no detail on its acquisition chain; treat as a distinct, MnDOT-owned pathway that happens to be displayed on the same USF page.

**Source I â€” Battery-voltage telemetry.** Each system self-reports its own battery voltage, and this is explicitly stated to travel the *same* path as that system's sensor payload (e.g., "the remote system's battery voltage was also monitored and sent to the host computer along with the thermal data," Chapter 3 precedent; the same pattern is used for Systems 1â€“3 in Chapter 4).

**Phase III (long-term monitoring).** The temporary DAS boxes were replaced by a permanent installation housed in an on-site DAS building/vault; "two systems... act as repeaters, whereby the data are collected and transmitted via Ethernet or similar communication to the far end of the bridge." The document gives almost no further detail on this permanent system's internal architecture (loggers, power, whether it reuses the CR1000/CR9000/MUX pattern) â€” **this is a real gap**: the long-term, in-service monitoring phase (the one most relevant to your stated "ongoing service-life loads" decision) is the least-documented part of the whole system.

---

## 2. Shared dependencies

Concrete, named shared dependencies as the document supports them, organized from tightest (single physical component) to loosest (shared condition/procedure):

**(a) Shared MUX per shaft/column, within System 2.** MUX1 (shaft 2, 16 VW gauges), MUX2 (shaft 1, 16 VW gauges), MUX3 (interior column, 10 VW gauges), MUX4 (exterior column, 10 VW gauges) each aggregate many "independent-looking" gauge channels onto one AVW200 input. Any fault in a MUX or in the single wire run between a MUX and its AVW200 puts every gauge behind that MUX at simultaneous risk.

**(b) Shared AVW200 analyzer.** Two AVW200 units each carry two MUXes' worth of channels â€” a second layer of aggregation above the MUX layer.

**(c) Shared data logger per system.** All VW/thermistor readings across both shafts and both columns funnel into the single CR1000 of System 2; all RT readings across both shafts and both columns funnel into the single CR9000 of System 3; all TC and camera data funnel into the single CR1000 of System 1. Within a system, the logger is a single point whose failure silences everything upstream of it in that system.

**(d) Shared cellular modem per system.** Each system (1, 2, 3) has its "own dedicated Raven100 CDMA AirLink cellular modem" â€” so the modem is *not* shared across systems, but it *is* shared across every gauge within that system, and the document reports this exact single-modem link as the thing that actually failed (EMF interference on System 1's modem, twice; degraded/unclear communication on System 2 for a period).

**(e) Shared environmental enclosure per system.** "Three large environmental enclosures were used to house and protect the DAS units and wire connections" for the three systems in Phase II â€” reasonably read as one enclosure per system (this is my inference from the count matching the three systems; the document does not say "one enclosure per system" in so many words). Within a system, this means the logger, modem, power supply, and MUXes/analyzers all share one physical box and its environment (heat, moisture, vibration, pests).

**(f) Shared PS100 power supply / battery / battery-manager design.** Each system had its own physical battery, so a dead battery in System 1 does not drain System 2 or 3. But the PS100 12-V supply's documented limitation â€” it "could only receive power from either an A/C source or the solar panel but not both" â€” is a **shared design flaw across any unit built the same way**, requiring an added "battery manager" workaround. The document's phrasing here is ambiguous about scope: this passage sits in the general Phase II power-consumption discussion, but the dual solar/A/C conflict matches only System 1's configuration (solar in Phase I, then A/C from the U.S. Army Corps of Engineers' adjacent supply, with battery backup, in Phase II); Systems 2 and 3 are never described as solar-powered. **The document does not specify** whether the battery-manager fix was applied to all three systems or only to System 1.

**(g) Shared physical conduit / wire bundling at installation.** TC wires and strain-gauge wires from the same shaft/footing/column were bundled together and pulled through the same PVC conduit (1.5-inch for shafts, 2-inch for footing and columns) by the same installation process. University of Minnesota's column gauge wires were likewise bundled with FHWA's and "pulled out to the DAS at the same time." A single conduit-level event (crush, water intrusion, wire damage during the pull) can affect wires belonging to multiple, otherwise electronically separate, gauge types and systems before they ever diverge to their respective MUXes/loggers.

**(h) Shared host computer and analysis/plotting software.** All three systems' data converge on the same USF Geotechnical Research Group host computer, running the same LoggerNet-adjacent processing and auto-plotting to the same public website. This is a single downstream point through which every stream must pass to become a "seen" value.

**(i) Shared calibration reference for column loads.** This is the most consequential and least visible dependency in the document. Column strain gauges (both VW/System 2 and RT/System 3) were calibrated **the same way**: "by correlating the number of box sections and their respective weights to the measured strain in each column, the column strain gauges were calibrated with increased confidence." Both gauge types, on fully separate hardware, are anchored to the *same* external reference (nominal/theoretical segment weights and the associated engineering assumptions about false-work reactions). This is a shared calibration dependency, not a shared hardware dependency.

**(j) Shared installation crew/procedure and shared physical siting.** All of Pier 2 southbound's temporary DAS boxes were removed together to allow construction of a public viewing platform â€” a shared scheduling/procedural dependency that affected every gauge type at once, documented as a real event (see Â§4).

**(k) Shared physical exposure to an external EMF source.** System 1's modem is reported to have lost/regained communication twice, attributed to a large electric power plant sited adjacent to the modem. **The document does not state** whether Systems 2 and 3, presumably sited in the same general on-site location, experienced the same interference â€” this is a plausible but unconfirmed shared vulnerability, and I flag it explicitly as inference, not documented fact.

**(l) Shared self-report channel.** Each system's battery-voltage telemetry rides the same logger/modem/host pipeline as its sensor data (item I above), so a fault in that pipeline could corrupt both the sensor values and the "I'm healthy" signal at once.

---

## 3. Affected properties

| Shared dependency | What it can affect if degraded/failed |
|---|---|
| (a) Single MUX (per shaft/column) | Loses/garbles data from **all gauges wired through that MUX** â€” an availability failure specific to that shaft or column, not a value-bias. Confirmed by the actual incident (Â§4): garbled ("unintelligible") data, not a plausible-looking wrong value. |
| (b) AVW200 analyzer | Loses data from both MUXes feeding it (up to 32 VW/thermistor channels) â€” availability, broader blast radius than (a). |
| (c) Logger (CR1000/CR9000) per system | Total loss of that entire system's data (both shafts + both columns for System 2; both shafts + both columns for System 3) â€” availability, not bias, since the logger is a storage/transmission point, not itself a transducer. |
| (d) Modem per system | Delays/loses transmission to the host but does **not** corrupt the underlying stored value â€” the data logger keeps recording locally regardless. This is a "silent/unavailable" failure, not a "wrong value" failure â€” important distinction the document itself draws out via the camera incident (Â§4), where images kept recording locally even though the transfer link failed. |
| (e) Enclosure per system | Could cause a correlated *sudden* failure of everything inside (moisture short, thermal extreme, physical damage) â€” availability, potentially total for that system. Document reports no actual enclosure-level incident. |
| (f) PS100/battery-manager design flaw | If it recurs identically in multiple systems (same PS100 model), each system would independently reach the same "voltage drops below threshold, ~8 hours of life left" failure â€” an availability failure, but *correlated in kind/timing pattern*, not literally simultaneous, since each system has its own battery draining on its own schedule. |
| (g) Shared conduit/wire bundle | Could cause simultaneous loss of specific wires across multiple gauge types/systems that happened to be pulled together â€” availability for the specific wires damaged; does not bias remaining, undamaged wires. |
| (h) Host computer/software | Could delay, misplot, or mislabel **all systems' data at once** in the public-facing record even if the raw logged values at each DAS remain correct â€” this is the one dependency in the list that could plausibly produce a *shared bias or misrepresentation* across every source simultaneously, precisely because it sits after all the raw measurements are already taken. |
| (i) Calibration reference (box-girder segment weights) | This is the dependency most capable of causing a **shared, systematic bias in the reported value itself** (not just an outage) across two hardware-independent systems (VW and RT) â€” if the nominal segment weights or false-work-reaction assumptions used to calibrate are off, both VW-derived and RT-derived column loads would be biased in the same direction by a similar magnitude, while both continue to "look like they're working." |
| (j) Shared removal/scheduling of DAS boxes | Total, simultaneous loss of all substructure gauge types at Pier 2 southbound for the duration of the gap â€” a pure availability effect but affecting every source at once regardless of hardware independence. |
| (k) Shared EMF exposure | If real and shared across systems, causes delayed/lost transmission (availability), not value corruption â€” same character as modem failures generally. |
| (l) Shared self-report channel | A pipeline fault could make a "healthy battery voltage" reading arrive alongside a corrupted or stale sensor reading, so the battery-voltage trace cannot be used to independently vouch for the sensor value's correctness when both ride the same channel. |

The key distinction the document lets me draw cleanly: **hardware/link/power/enclosure/conduit dependencies mostly cause a source to go silent or garbled (availability failures)**, while **the calibration-reference dependency (i) is the one clear case that could cause a source to report a plausible-looking but wrong value while continuing to appear operational** â€” which is the more dangerous failure mode for a safety decision, since silence is at least detectable.

---

## 4. Failure effects, including the document's own reported incidents

The document reports several real incidents, which is valuable because it shows actual failure *behavior*, not just theoretical risk:

1. **Cellular timeout (Chapter 3, voided-shaft precedent).** The modem stopped transmitting; a site visit to reset the modem fixed it, and it recurred zero more times. **Character:** sudden, total, binary link failure â€” not self-healing, required physical intervention.

2. **Battery drain from an over-aggressive hourly-transmit schedule (Chapter 3, voided-shaft precedent).** Left at maximum transmit frequency, the modem's power draw exhausted the battery in a few hours; even after the schedule was revised to sleep/wake, the battery still drained faster than desired, needing three site visits to recharge, with an observed "cliff": below 11.6 V, the system had ~8 hours of life left before a hard shutdown. **Character:** predictable, threshold-triggered, total failure preceded by a *quantifiable* slow drift (declining voltage) â€” i.e., not purely sudden, there's an instrumented warning period before the cliff.

3. **EMF interference from an adjacent power plant (I-35W, System 1, Phase I).** Cellular communication was lost and then regained twice; attributed to electromagnetic interference from a large power plant next to the modem. **Character:** intermittent, environmentally triggered, apparently self-recovering (the document does not say a site visit was needed this time) â€” an availability blip, not a bias.

4. **Camera-to-logger transfer failure (I-35W, System 1, March 19, 2008).** Communication between the camera and logger failed; critically, "the camera was still recording images to its internal compact flash card, but images were not transferred to the logger for scheduled collection." A baud-rate reduction cleared it. **Character:** this is the clearest documented case of a *transmission-link* failure that did **not** destroy the underlying raw evidence â€” the raw photos survived locally even while the shared pathway to the host failed. This is important precedent for treating "delayed/stale" as a distinct failure mode from "destroyed."

5. **Unexplained possible outage, System 2 (Feb 5â€“Mar 26, 2008 window).** After that period, "no collections were possible... It was unclear whether the system was still powered and logging," though power cycling had been regular up to the last collection, making a simple power failure unlikely. **The document itself flags this as unresolved** â€” it does not know the cause. This is a useful, honest admission in the source that not every anomaly gets diagnosed; a downstream reader treating "System 2 went dark, cause unknown" as equivalent to "System 2 confirmed a null result" would be wrong.

6. **Partially cut wire between a MUX and an AVW200 (I-35W, System 2).** "The data collected from one of the four multiplexing units responsible for monitoring nine of the vibrating wire gauges were unintelligible. An onsite visit was required to find a partially cut wire between the MUX unit and AVW-200, and it had started as intermittent and ultimately resulted in complete failure." **Character:** this is the single clearest real-world demonstration of a shared-wiring/MUX dependency actually failing, and it shows a **gradual-to-sudden pattern** â€” intermittent degradation escalating to complete failure â€” consistent with physical wire damage worsening under vibration/thermal cycling rather than a clean, instantaneous fault. Note an unresolved detail: the affected MUX serves either 16 or 10 gauges depending on which MUX it was, yet only **9** gauges were reported unintelligible â€” **the document does not explain why the failure was partial rather than total for that MUX**, which matters because it undercuts a simplistic "one MUX = one all-or-nothing failure unit" model.

7. **Simultaneous removal of all temporary DAS boxes for a viewing platform (I-35W, Pier 2 southbound).** All substructure gauge types lost data together for nearly a month, and there was genuine uncertainty whether the permanent DAS would be ready in time for the scheduled truck tests â€” resolved only by FGE sending personnel to manually reconnect the temporary units the day before testing. **Character:** total, simultaneous, non-electronic (organizational/scheduling) failure across every source at Pier 2 southbound at once â€” arguably the most severe "shared dependency" failure in the whole account, because it wasn't a component fault at all but a project-management decision that happened to gate every sensor's availability identically.

8. **Coverage gap, not a failure but load-bearing for your decision framing:** only 2 of the 8 shafts under Pier 2 (southbound) were instrumented; "the load carried by the other six shafts was not monitored, and the response therein could only be estimated based on engineering principles." This isn't a shared-dependency failure, but it is directly relevant to any claim that "the shaft data confirm the pier is behaving safely" â€” the two monitored shafts cannot corroborate anything about the other six.

---
