# AgniDrishti --- Data Audit

**Version:** 0.1\
**Research snapshot:** 15 October 2026\
**Purpose:** Assess candidate datasets for the research phase and
pitching prototype before selecting a pilot region or training a model.

## 1. Executive summary

The data strategy should be built around a small number of sources that
can be inspected and reproduced: - NASA FIRMS VIIRS and MODIS for
active-fire/thermal-anomaly observations. - Sentinel-2 for land-surface
and vegetation context. - Official Indian agricultural statistics for
crop area and production. - Historical weather data for temporal
context. - Official wheat-residue-burning monitoring reports where
available. - Government/industry buyer listings and direct verification
for market feasibility.

No single source proves that a hotspot is wheat-residue burning. No
public buyer directory alone proves that a specific buyer will purchase
raw straw from a specific farm at a profitable price. These are separate
validation problems.

## 2. Candidate data inventory

  ------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Dataset / source        Candidate fields              Spatial / temporal     Access                Intended use       Main limitations       Status / next action
                                                        characteristics                                                                        
  ----------------------- ----------------------------- ---------------------- --------------------- ------------------ ---------------------- ---------------------
  NASA FIRMS VIIRS        Latitude, longitude,          Nominal 375 m pixel    Map/API; free MAP_KEY Main screening     Thermal anomaly is not High priority:
  active-fire detections  acquisition date/time,        footprint; detection   required for API use  layer for fire     a crop/type label;     download bounded
                          satellite, confidence, FRP,   points are not exact                         activity           cloud and overpass     district/date
                          scan/track and product        fire boundaries; NRT                                            gaps can miss fires;   samples; prefer
                          metadata                      and standard products                                           confidence needs       standard-processing
                                                        available                                                       careful interpretation data for
                                                                                                                                               retrospective
                                                                                                                                               research when
                                                                                                                                               available

  NASA FIRMS MODIS        Latitude, longitude,          Nominal 1 km pixel     Map/API; free MAP_KEY Longer historical  Coarser spatial        Use as supplementary
  active-fire detections  date/time, confidence, FRP    footprint              required              context and        resolution; not        history, not as a
                          and metadata                                                               comparison with    directly equivalent to substitute for VIIRS
                                                                                                     VIIRS              VIIRS counts           

  Sentinel-2 optical      Multispectral bands, surface  Four bands at 10 m;    Copernicus Data Space Land               Optical observations   High priority for a
  imagery                 reflectance, vegetation       six at 20 m; three at  Ecosystem; open data  cover/vegetation   can be obscured by     small candidate-area
                          indices, cloud mask           60 m; mission revisit  subject to platform   change and         clouds; imagery alone  time series; verify
                                                        is designed around 5   terms/quotas          crop/harvest       cannot establish fire  image availability
                                                        days at the Equator,                         context            cause or measure       around harvest
                                                        with actual usable                                              residue mass           
                                                        observations affected                                                                  
                                                        by clouds and                                                                          
                                                        acquisition coverage                                                                   

  Official agricultural   Crop area, production, yield  Administrative         Ministry of           Estimate wheat     Publication lags,      High priority:
  statistics (India)      by state and, where           reporting; frequency   Agriculture           cultivation        revisions, missing     document exact table,
                          available, district/season    and granularity depend statistics portal and footprint and      district granularity,  year, crop season,
                                                        on table               crop query portal     shortlist          and differences        units, and whether
                                                                                                     candidate          between                figures are
                                                                                                     districts          estimates/final data   provisional

  Official                Reported residue-burning      Depends on the report  ICAR/IARI or relevant Crop-specific      Method, sensor,        High priority: locate
  wheat-residue-burning   events/counts by district and and satellite method   government            reference and      spatial unit, and      the latest report
  monitoring reports      period; method metadata if                           research/monitoring   external check on  reporting period must  with a stable URL and
                          provided                                             publication portals   FIRMS              be read carefully;     archive the
                                                                                                     interpretation     counts may not be      PDF/source metadata
                                                                                                                        comparable across      
                                                                                                                        sources or years       

  Historical weather /    Precipitation, temperature,   Open-Meteo documents   Open-Meteo Historical Context features   Reanalysis is gridded  Medium priority: use
  reanalysis              humidity/dew point, wind,     ERA5 at 0.25° and      Weather API; other    and retrospective  and modeled; local     district/grid
                          soil moisture where available ERA5-Land at 0.1°;     official/reanalysis   analysis; not      microconditions may    summaries and align
                                                        ERA5-Land is still     sources may be used   direct evidence of differ; weather does   time zones and
                                                        much coarser than an                         fire cause         not prove the origin   observation dates
                                                        individual field                                                of a fire              

  SAMARTH vendor/pellet   Vendor, state/district, plant Company/facility       Government of India   Discover potential A pellet vendor or     High priority for
  offer directory         capacity, pellet type,        listings;              Ministry of Power     biomass industry   tender is not          discovery, followed
                          offered stock, continuous     update/validity varies portal                participants and   necessarily a          by direct
                          delivery, listed raw                                                       feedstock          raw-straw buyer;       verification of
                          materials, offer dates                                                     requirements       listings can expire    feedstock, price,
                                                                                                                        and raw materials may  volume, and logistics
                                                                                                                        be different from      
                                                                                                                        wheat straw            

  SAMARTH pellet          Trader/aggregator, location,  Listing-level;         Government of India   Identify           Self-described         Use as leads only;
  trader/aggregator       business description, contact coverage and freshness Ministry of Power     intermediaries     profiles and listed    record verification
  directory               details                       vary                   portal                that may aggregate contacts do not        date and contact
                                                                                                     agricultural       establish a current    outcome
                                                                                                     residues           purchase commitment    

  Government biomass      Tender description, quantity, Tender-specific        SAMARTH and relevant  Estimate           Tenders may specify    Extract product form,
  procurement tenders     delivery terms, product                              procurement portals   industrial demand  processed pellets, not volume, delivery
                          specification, deadline                                                    and specification  raw wheat straw;       point, quality and
                                                                                                     requirements       closed tenders do not  date; do not treat as
                                                                                                                        establish current      raw-straw price
                                                                                                                        demand                 

  Local fodder market /   Raw straw type,               Local and              Direct                Compare the        Price and demand may   Required primary
  cattle feed buyers      moisture/quality              transaction-specific   outreach/survey;      potentially        be informal, seasonal, research; do not
                          requirements, volume,                                public data may be    shorter-distance   and location-specific  invent prices for the
                          farm-gate or delivered price,                        limited               local market with                         prototype
                          seasonality                                                                industrial buyers                         

  Farmer/field validation Crop, harvest date, field     Field-specific and     Survey, partner, or   Validate satellite Requires consent,      Needed before
  sample                  area, residue condition,      consent-based          pilot collection      attribution, image careful sampling, and  operational claims;
                          management decision, measured                                              categories,        time; self-reported    for hackathon,
                          mass, sale/collection cost,                                                residue estimates, intent may be biased   disclose if simulated
                          buyer, outcome                                                             unit economics,                           
                                                                                                     and counterfactual                        

  Photo samples of        Field photos, visual          Image-level; quality   Collected with        Prototype visual   A photo alone cannot   Define capture
  residue                 condition, scale/reference,   depends on capture     consent or licensed   categories and     reliably infer         protocol and
                          label, measured               protocol               imagery               future computer    tonnage/moisture       buyer-relevant labels
                          moisture/mass/contamination                                                vision training    without calibration;   before collecting a
                          where relevant                                                                                domain shift across    dataset
                                                                                                                        lighting/soil/camera   
  ------------------------------------------------------------------------------------------------------------------------------------------------------------------

## 3. Source details and access

### 3.1 NASA FIRMS

-   Map and caveats: https://firms.modaps.eosdis.nasa.gov/map2/
-   Fire-alert notes:
    https://firms2.modaps.eosdis.nasa.gov/alerts/notes.php
-   Area API: https://firms2.modaps.eosdis.nasa.gov/api/area/
-   MAP_KEY: https://firms.modaps.eosdis.nasa.gov/api/map_key/
-   API tutorial:
    https://firms2.modaps.eosdis.nasa.gov/content/academy/data_api/firms_api_use.html

Important details: - VIIRS has a nominal 375 m pixel footprint, while
MODIS has a nominal 1 km footprint. - The displayed footprint is not a
precise fire boundary and does not mean the whole pixel is burning. -
Detections can represent fire, hot smoke, agricultural or other thermal
sources. - Cloud cover and satellite overpass timing can cause missed
detections. - Acquisition times are in UTC in FIRMS products; convert
consistently when aligning with local harvest calendars. - The FIRMS API
requires a free MAP_KEY. API request limits and product availability
should be checked before designing a recurring pipeline. - For
retrospective science use, record the product/version and prefer
standard-processing products when available, since near-real-time
products may be reprocessed.

### 3.2 Sentinel-2

-   Official overview:
    https://dataspace.copernicus.eu/data-collections/copernicus-sentinel-missions/sentinel-2
-   Data access portal: https://dataspace.copernicus.eu/
-   Explore imagery: https://dataspace.copernicus.eu/explore-data

Sentinel-2 provides optical multispectral imagery suitable for
vegetation and land-surface monitoring. The nominal band resolutions are
10 m, 20 m, and 60 m. It can help characterize agricultural context and
changes around harvest, but it should not be treated as definitive
evidence of crop type, residue quantity, or fire cause without
validation. Check cloud cover and usable observations for the chosen
date range.

### 3.3 Crop statistics

-   Agricultural Statistics at a Glance:
    https://desagri.gov.in/document-report-category/agriculture-statistics-at-a-glance/
-   Crop query portal:
    https://data.desagri.gov.in/website/apy-query-report-crop-season-web

Use official crop-area and production tables to screen candidate
regions. Keep state-level and district-level values separate. Record the
crop year, reporting status, units, table number, and retrieval date. Do
not infer residue tonnage directly from wheat production without a
documented residue-to-grain ratio and local assumptions.

### 3.4 Weather

-   Open-Meteo Historical Weather API:
    https://open-meteo.com/en/docs/historical-weather-api

The service documents historical reanalysis including ERA5 and
ERA5-Land. ERA5-Land's nominal 0.1° grid is still coarse relative to
individual fields. Weather is contextual information for risk analysis,
not proof that a hotspot is agricultural or intentional. Preserve units,
timestamp, timezone, and the exact product/model used.

### 3.5 Buyer and industrial demand discovery

-   SAMARTH vendor details:
    https://samarth.powermin.gov.in/account/vendordetails
-   SAMARTH aggregator listings:
    https://samarth.powermin.gov.in/account/pellettraderaggregator
-   SAMARTH tenders: https://samarth.powermin.gov.in/home/tenders

These are useful starting points for discovering biomass market
participants and industrial procurement signals. The product form
matters: a tender for biomass pellets is not automatically a tender for
raw wheat straw. For each lead, verify: - accepted raw feedstock and
whether wheat straw is accepted; - required processing and quality
specifications; - purchase quantity and minimum delivery; - price basis
(farm-gate, collection point, or delivered); - season and contract
validity; - collection, storage, baling, moisture, and transport
responsibilities; - evidence that the contact/offer is current.

## 4. Minimum data model for the research phase

The research prototype should use a compact, auditable schema. It does
not need a production database yet.

### `fire_observations`

-   `observation_id`
-   `source` (e.g., VIIRS_NRT, VIIRS_SP, MODIS_SP)
-   `latitude`, `longitude`
-   `acquired_at_utc`
-   `confidence` (preserve original source meaning)
-   `frp`
-   `product_version`
-   `source_url_or_file`
-   `ingested_at`

### `agricultural_context`

-   `area_id` / grid identifier
-   `admin_region`
-   `crop`
-   `crop_year` / `season`
-   `crop_area`
-   `harvest_window_start`, `harvest_window_end`
-   `land_cover_source`
-   `imagery_date`
-   `cloud_or_quality_flag`

### `event_labels`

-   `observation_id` or area/time key
-   `label` (`probable_wheat_residue_burning`, `other_likely_source`,
    `unknown`)
-   `label_source`
-   `evidence_level`
-   `reviewer_or_method`
-   `notes`

Do not label every FIRMS hotspot on agricultural land as confirmed
wheat-residue burning. `Unknown` is a valid and necessary label.

### `buyer_leads`

-   `buyer_id`
-   `buyer_type` (`local_fodder`, `aggregator`, `biomass_processor`,
    `industrial_user`)
-   `location`
-   `accepted_feedstock`
-   `raw_straw_accepted`
-   `required_form_or_processing`
-   `quality_specification`
-   `minimum_volume`
-   `price_basis`
-   `quoted_price`
-   `transport_responsibility`
-   `offer_valid_from`, `offer_valid_to`
-   `verification_status`
-   `last_verified_at`
-   `source`

### `economics_scenarios`

-   `scenario_id`
-   `residue_mass_t`
-   `payment_to_farmer`
-   `collection_cost`
-   `baling_or_processing_cost`
-   `storage_cost`
-   `transport_cost`
-   `platform_or_service_cost`
-   `farmer_net`
-   `buyer_value`
-   `buyer_margin`
-   `assumptions`
-   `scenario_type` (`observed`, `derived`, `illustrative`)

### `prototype_transactions`

-   `transaction_id`
-   `farmer_or_demo_profile`
-   `buyer_id`
-   `offered_mass`
-   `offered_price`
-   `pickup_status`
-   `verified_mass`
-   `payment_status`
-   `transaction_status`
-   `is_simulated`
-   `impact_estimate_status`

For a static pitching prototype, all transaction records should include
`is_simulated=true` unless they represent real, verified transactions.

## 5. Quality, leakage, and validation controls

### Fire attribution

-   Keep thermal anomaly observations separate from inferred cause
    labels.
-   Use an independent source or reviewed sample to validate labels.
-   Track `unknown` rather than forcing all points into a
    positive/negative class.
-   Compare sensor products carefully; VIIRS and MODIS have different
    resolution and detection behavior.
-   Record product versions and whether data is NRT or standard
    processing.

### Forecast evaluation

-   Create time-aware training/test partitions; do not randomly split
    nearby observations if this creates temporal leakage.
-   Use only data available at the forecast issuance time.
-   Compare with a simple historical/seasonal baseline before testing
    XGBoost.
-   Report precision, recall, PR-AUC, false positives, calibration, and
    operational burden.
-   Treat any target such as 70% recall as an experimental objective,
    not an existing performance claim.

### Image classification

-   Define labels from buyer decisions and field measurements, not
    purely aesthetic visual differences.
-   Collect representative photos across soil, lighting, camera, harvest
    methods, and residue conditions.
-   Keep a held-out test set from different fields/dates where possible.
-   Never display exact tonnage, moisture, or price as image-derived
    facts without calibration.

### Economics

-   Compare with the farmer's real alternative, including existing local
    sales and uses.
-   Separate observed price quotes from assumptions.
-   Include collection, baling, storage, loading, and transport costs.
-   Test sensitivity to distance, mass, moisture, price, minimum volume,
    and season.
-   Do not claim a transaction is viable unless both farmer-side and
    buyer-side economics are plausible.

### Environmental impact

-   Track mass collected separately from mass believed to be diverted
    from burning.
-   Make the counterfactual assumption explicit.
-   Apply emissions factors by residue type and pollutant; do not turn a
    general crop-burning health estimate into a project-specific
    avoided-emissions number.
-   Label results as verified operational metrics or estimated
    environmental impacts.

## 6. Data acquisition plan

### Phase A --- Quick feasibility sample

1.  Choose 2--4 candidate districts based on wheat production and access
    to official residue-burning records, without committing to a pilot.
2.  Download a small, documented sample of VIIRS observations for
    harvest windows across several years; include standard and NRT
    products only if their roles are clearly separated.
3.  Find available Sentinel-2 scenes before and after harvest for a
    subset of locations.
4.  Collect official crop statistics at the finest reliable
    administrative level.
5.  Record all missing fields, coverage gaps, and source-version
    differences.

### Phase B --- Independent validation

1.  Find wheat-residue-specific monitoring reports and extract their
    method and spatial unit.
2.  Compare their reported events with FIRMS observations in space and
    time.
3.  Sample matched non-event agricultural periods/areas to estimate
    false positives and selection bias.
4.  If feasible, obtain ground reports, survey records, or partner
    observations for a subset.
5.  Keep the attribution label and evidence level explicit.

### Phase C --- Market validation

1.  Shortlist local fodder buyers and biomass aggregators/processors.
2.  Verify raw wheat-straw acceptance, required quality, quantity, price
    basis, seasonality, and transport terms.
3.  Build at least low/base/high cost scenarios for collection and
    transport.
4.  Reject or flag buyer matches with unverified acceptance or negative
    economics.
5.  Use simulated offers only for the visual demo and label them
    clearly.

## 7. Data audit status at this version

  ------------------------------------------------------------------------
  Area                     Status                  Confidence
  ------------------------ ----------------------- -----------------------
  NASA FIRMS product       Official documentation  High for product
  characteristics and API  located                 description; not yet
  availability                                     audited for a specific
                                                   district/time range

  Sentinel-2 access and    Official Copernicus     High for mission
  nominal resolution       documentation located   characteristics; actual
                                                   scene/cloud
                                                   availability not yet
                                                   checked

  India crop statistics    Official portal located High for source
  portal                                           identity;
                                                   district-level
                                                   completeness and exact
                                                   tables still need
                                                   checking

  Wheat-residue-specific   Research lead           Incomplete
  fire reference           identified; exact       
                           latest bulletin and     
                           stable URL still need   
                           to be archived          

  Weather source           Historical API          High for documented
                           documentation located   product description;
                                                   fit for specific
                                                   district/date range not
                                                   yet tested

  Industrial biomass buyer Official SAMARTH        Medium for market
  leads                    listings and tenders    discovery; low for
                           located                 verified raw
                                                   wheat-straw demand in a
                                                   selected pilot area

  Local fodder market      No district-specific    Incomplete
                           price/volume dataset    
                           validated yet           

  Field-calibrated residue Not yet assembled       Incomplete
  image/tonnage dataset                            

  Causal intervention      No AgniDrishti          Not established
  effect                   intervention trial      
                           exists                  
  ------------------------------------------------------------------------

## 8. Reference links

1.  NASA FIRMS: https://firms.modaps.eosdis.nasa.gov/map2/
2.  NASA FIRMS notes:
    https://firms2.modaps.eosdis.nasa.gov/alerts/notes.php
3.  NASA FIRMS area API: https://firms2.modaps.eosdis.nasa.gov/api/area/
4.  NASA FIRMS API MAP_KEY:
    https://firms.modaps.eosdis.nasa.gov/api/map_key/
5.  Copernicus Sentinel-2:
    https://dataspace.copernicus.eu/data-collections/copernicus-sentinel-missions/sentinel-2
6.  Copernicus Data Space Ecosystem: https://dataspace.copernicus.eu/
7.  Government of India Agricultural Statistics at a Glance:
    https://desagri.gov.in/document-report-category/agriculture-statistics-at-a-glance/
8.  Government of India crop query portal:
    https://data.desagri.gov.in/website/apy-query-report-crop-season-web
9.  Open-Meteo Historical Weather API:
    https://open-meteo.com/en/docs/historical-weather-api
10. SAMARTH vendor details:
    https://samarth.powermin.gov.in/account/vendordetails
11. SAMARTH aggregators:
    https://samarth.powermin.gov.in/account/pellettraderaggregator
12. SAMARTH tenders: https://samarth.powermin.gov.in/home/tenders
13. Lopes et al. (2023), wheat-residue burning study:
    https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0296059
14. Lan et al. (2022), crop-residue burning air-quality impacts:
    https://www.nature.com/articles/s41467-022-34093-z

------------------------------------------------------------------------

**Status:** Initial audit. This is not a guarantee of data availability,
a selected pilot district, a validated model, or verified market demand.
