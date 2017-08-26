'use strict';

const Alexa = require('alexa-sdk');
const https = require('https');

const teamData = [{"id":2225,"n":"Aachen","c":"Germany","t":null,"s":20},{"id":2342,"n":"Aalto-Helsinki","c":"Finland","t":"Manufacturing","s":13},{"id":2217,"n":"AFCM-Egypt","c":"Egypt","t":"Therapeutics","s":22},{"id":2459,"n":"AHUT_China","c":"United States","t":"Information Processing","s":23},{"id":2255,"n":"Aix-Marseille","c":"France","t":"Environment","s":44},{"id":2457,"n":"Amazonas_Brazil","c":"Brazil","t":"Foundational Advance","s":25},{"id":2385,"n":"Amsterdam","c":"Netherlands","t":"Manufacturing","s":12},{"id":2270,"n":"AQA_Unesp","c":"Brazil","t":"Therapeutics","s":17},{"id":2357,"n":"Arizona_State","c":"United States","t":"Information Processing","s":10},{"id":2252,"n":"AshesiGhana","c":"Ghana","t":"Environment","s":11},{"id":2226,"n":"ASIJ_TOKYO","c":"Japan","t":"High School","s":22},{"id":2509,"n":"ASTWS-China","c":"China","t":"High School","s":13},{"id":2253,"n":"Austin_UTexas","c":"United States","t":null,"s":15},{"id":2458,"n":"Austin_UTexas_LASA","c":"United States","t":"High School","s":15},{"id":2436,"n":"Baltimore_Bio-Crew","c":"United States","t":"High School","s":13},{"id":2482,"n":"Berlin_diagnostX","c":"Germany","t":null,"s":10},{"id":2371,"n":"BGIC-Union","c":"China","t":"High School","s":14},{"id":2201,"n":"Bielefeld-CeBiTec","c":"Germany","t":"Foundational Advance","s":19},{"id":2234,"n":"Bilkent-UNAMBG","c":"Turkey","t":"Diagnostics","s":12},{"id":2305,"n":"BIT","c":"China","t":"Diagnostics","s":35},{"id":2368,"n":"BIT-China","c":"China","t":"Food & Nutrition","s":26},{"id":2326,"n":"BNDS_China","c":"China","t":"High School","s":14},{"id":2220,"n":"BNU-China","c":"China","t":null,"s":26},{"id":2294,"n":"BOKU-Vienna","c":"Austria","t":"Foundational Advance","s":22},{"id":2307,"n":"Bordeaux","c":"France","t":null,"s":24},{"id":2411,"n":"BostonU","c":"United States","t":null,"s":12},{"id":2409,"n":"BostonU_HW","c":"United States","t":"Hardware","s":9},{"id":2337,"n":"Botchan_Lab_Tokyo","c":"Japan","t":null,"s":12},{"id":2293,"n":"Bristol","c":"United Kingdom","t":null,"s":14},{"id":2433,"n":"British_Columbia","c":"Canada","t":null,"s":14},{"id":2515,"n":"Bulgaria","c":"Bulgaria","t":null,"s":4},{"id":2248,"n":"Cadets2Vets","c":"United States","t":"Environment","s":19},{"id":2260,"n":"Calgary","c":"Canada","t":null,"s":31},{"id":2465,"n":"CAPS_Kansas","c":"United States","t":"High School","s":3},{"id":2404,"n":"Cardiff_Wales","c":"United Kingdom","t":null,"s":12},{"id":2491,"n":"CCA_San_Diego","c":"United States","t":"High School","s":24},{"id":2292,"n":"CCU_Taiwan","c":"Taiwan","t":null,"s":24},{"id":2376,"n":"CGU_Taiwan","c":"Taiwan","t":null,"s":17},{"id":2329,"n":"Chalmers-Gothenburg","c":"Sweden","t":"Diagnostics","s":15},{"id":2281,"n":"CIEI-BJ","c":"China","t":"High School","s":17},{"id":2322,"n":"CIEI-China","c":"China","t":"High School","s":17},{"id":2206,"n":"CLSB-UK","c":"United Kingdom","t":"High School","s":20},{"id":2467,"n":"CMUQ","c":"Qatar","t":"Environment","s":11},{"id":2498,"n":"ColegioFDR_Peru","c":"Peru","t":"High School","s":17},{"id":2271,"n":"Cologne-Duesseldorf","c":"Germany","t":"Foundational Advance","s":29},{"id":2412,"n":"ColumbiaNYC","c":"United States","t":null,"s":10},{"id":2296,"n":"Cornell","c":"United States","t":null,"s":32},{"id":2506,"n":"CPU_CHINA","c":"China","t":"Therapeutics","s":14},{"id":2382,"n":"CSMU_NCHU_Taiwan","c":"Taiwan","t":null,"s":15},{"id":2204,"n":"CSU_Fort_Collins","c":"United States","t":null,"s":6},{"id":2249,"n":"CU-Boulder","c":"United States","t":null,"s":13},{"id":2331,"n":"Dalhousie","c":"Canada","t":null,"s":21},{"id":2435,"n":"Dartmouth","c":"United States","t":null,"s":9},{"id":2441,"n":"DEIAGRA","c":"India","t":"Environment","s":11},{"id":2444,"n":"Delaware","c":"United States","t":"Therapeutics","s":13},{"id":2410,"n":"Delgado-Ivy-Marin","c":"United States","t":null,"s":9},{"id":2355,"n":"DTU-Denmark","c":"Denmark","t":null,"s":15},{"id":2464,"n":"Duke","c":"United States","t":null,"s":7},{"id":2290,"n":"East_Chapel_Hill","c":"United States","t":"High School","s":13},{"id":2308,"n":"ECUST","c":"China","t":"Energy","s":21},{"id":2330,"n":"Edinburgh_OG","c":"United Kingdom","t":null,"s":13},{"id":2406,"n":"Edinburgh_UG","c":"United Kingdom","t":null,"s":13},{"id":2487,"n":"Emory","c":"United States","t":null,"s":15},{"id":2203,"n":"EPFL","c":"Switzerland","t":"Diagnostics","s":16},{"id":2511,"n":"EpiphanyNYC","c":"United States","t":"High School","s":3},{"id":2500,"n":"ETH_Zurich","c":"Switzerland","t":"Therapeutics","s":14},{"id":2448,"n":"Evry_Paris-Saclay","c":"France","t":null,"s":7},{"id":2193,"n":"Example","c":"United States","t":"Energy","s":11},{"id":2324,"n":"Exeter","c":"United Kingdom","t":null,"s":19},{"id":2384,"n":"FAFU-CHINA","c":"China","t":null,"s":27},{"id":2523,"n":"Florida_Atlantic","c":"United States","t":"Software","s":14},{"id":2419,"n":"Franconia","c":"Germany","t":null,"s":39},{"id":2295,"n":"Freiburg","c":"Germany","t":"Therapeutics","s":22},{"id":2367,"n":"FSU","c":"United States","t":"Therapeutics","s":15},{"id":2446,"n":"Fudan","c":"China","t":"Information Processing","s":12},{"id":2460,"n":"Fudan_China","c":"China","t":"Information Processing","s":10},{"id":2221,"n":"Gaston_Day_School","c":"United States","t":null,"s":9},{"id":2524,"n":"Georgia_State","c":"United States","t":null,"s":15},{"id":2438,"n":"Gifu","c":"Japan","t":null,"s":17},{"id":2442,"n":"Glasgow","c":"United Kingdom","t":null,"s":15},{"id":2364,"n":"Greece","c":"Greece","t":null,"s":21},{"id":2299,"n":"Grenoble-Alpes","c":"France","t":null,"s":14},{"id":2361,"n":"Groningen","c":"Netherlands","t":"Food & Nutrition","s":17},{"id":2415,"n":"GZHS-United","c":"China","t":"High School","s":11},{"id":2401,"n":"Hamburg","c":"Germany","t":"Therapeutics","s":27},{"id":2251,"n":"Harvard","c":"United States","t":null,"s":8},{"id":2304,"n":"HBUT-China","c":"China","t":"Environment","s":23},{"id":2398,"n":"Heidelberg","c":"Germany","t":"Foundational Advance","s":20},{"id":2346,"n":"HFLS_H2Z_Hangzhou","c":"China","t":"High School","s":15},{"id":2466,"n":"HFUT-China","c":"China","t":"Software","s":20},{"id":2219,"n":"HK_SKHLPSS","c":"Hong Kong","t":"High School","s":19},{"id":2414,"n":"HokkaidoU_Japan","c":"Japan","t":null,"s":6},{"id":2254,"n":"Hong_Kong-CUHK","c":"Hong Kong","t":null,"s":19},{"id":2202,"n":"Hong_Kong_HKU","c":"Hong Kong","t":"Diagnostics","s":20},{"id":2240,"n":"Hong_Kong_HKUST","c":"Hong Kong","t":"Foundational Advance","s":32},{"id":2197,"n":"Hong_Kong_UCCKE","c":"Hong Kong","t":"High School","s":19},{"id":2336,"n":"HUST-China","c":"China","t":null,"s":6},{"id":2381,"n":"HZAU-China","c":"China","t":"Foundational Advance","s":19},{"id":2479,"n":"ICT-Mumbai","c":"India","t":"Environment","s":7},{"id":2319,"n":"IISc-Bangalore","c":"India","t":null,"s":25},{"id":2320,"n":"IISER-Mohali-INDIA","c":"India","t":null,"s":10},{"id":2258,"n":"IISER-Pune-India","c":"India","t":"Diagnostics","s":13},{"id":2318,"n":"IIT-Madras","c":"India","t":null,"s":19},{"id":2525,"n":"IIT_Delhi","c":"India","t":null,"s":2},{"id":2278,"n":"INSA-UPS_France","c":"France","t":null,"s":21},{"id":2282,"n":"IONIS-PARIS","c":"France","t":null,"s":23},{"id":2378,"n":"ITB_Indonesia","c":"Indonesia","t":"Energy","s":19},{"id":2363,"n":"iTesla-SoundBio","c":"United States","t":"Environment","s":22},{"id":2317,"n":"Jilin_China","c":"China","t":"Environment","s":23},{"id":2358,"n":"JNFLS","c":"China","t":"High School","s":18},{"id":2245,"n":"Judd_UK","c":"United Kingdom","t":"High School","s":17},{"id":2335,"n":"KAIT_JAPAN","c":"Japan","t":null,"s":11},{"id":2340,"n":"Kent","c":"United Kingdom","t":null,"s":13},{"id":2268,"n":"Kingsborough_NY","c":"United States","t":null,"s":12},{"id":2233,"n":"Kobe","c":"Japan","t":"Food & Nutrition","s":11},{"id":2437,"n":"KUAS_Korea","c":"Korea, Republic Of","t":null,"s":10},{"id":2263,"n":"KU_Leuven","c":"Belgium","t":"New Application","s":16},{"id":2403,"n":"Kyoto","c":"Japan","t":null,"s":8},{"id":2353,"n":"Lambert_GA","c":"United States","t":"High School","s":13},{"id":2377,"n":"Lanzhou","c":"China","t":"Environment","s":18},{"id":2443,"n":"Lethbridge","c":"Canada","t":null,"s":24},{"id":2481,"n":"Lethbridge_HS","c":"Canada","t":"High School","s":17},{"id":2474,"n":"Linkoping_Sweden","c":"Sweden","t":null,"s":14},{"id":2478,"n":"LUBBOCK_TTU","c":"United States","t":null,"s":18},{"id":2266,"n":"Lund","c":"Sweden","t":"Environment","s":14},{"id":2300,"n":"Macquarie_Australia","c":"Australia","t":"Energy","s":18},{"id":2213,"n":"Manchester","c":"United Kingdom","t":"Environment","s":13},{"id":2238,"n":"ManhattanCol_Bronx","c":"United States","t":null,"s":16},{"id":2470,"n":"McMasterU","c":"Canada","t":null,"s":31},{"id":2493,"n":"McMaster_II","c":"Canada","t":null,"s":12},{"id":2395,"n":"Melbourne","c":"Australia","t":null,"s":11},{"id":2301,"n":"Michigan","c":"United States","t":null,"s":17},{"id":2274,"n":"Michigan_Software","c":"United States","t":"Software","s":22},{"id":2230,"n":"Mingdao","c":"Taiwan","t":"High School","s":20},{"id":2375,"n":"Minnesota","c":"United States","t":null,"s":14},{"id":2362,"n":"Missouri_Rolla","c":"United States","t":"Environment","s":5},{"id":2429,"n":"MIT","c":"United States","t":null,"s":13},{"id":2488,"n":"Moscow_RF","c":"Russian Federation","t":null,"s":11},{"id":2405,"n":"MSU-Michigan","c":"United States","t":"Environment","s":9},{"id":2323,"n":"Munich","c":"Germany","t":null,"s":22},{"id":2256,"n":"Nagahama","c":"Japan","t":null,"s":9},{"id":2257,"n":"Nanjing-China","c":"China","t":null,"s":18},{"id":2209,"n":"Nanjing_NFLS","c":"China","t":"High School","s":19},{"id":2365,"n":"NAU-CHINA","c":"China","t":"Food & Nutrition","s":28},{"id":2348,"n":"NAWI_Graz","c":"Austria","t":"Information Processing","s":19},{"id":2275,"n":"NCKU_Tainan","c":"Taiwan","t":"Environment","s":22},{"id":2262,"n":"NCTU_Formosa","c":"Taiwan","t":null,"s":24},{"id":2302,"n":"NEFU_China","c":"China","t":null,"s":3},{"id":2288,"n":"NEU-China","c":"China","t":null,"s":12},{"id":2205,"n":"Newcastle","c":"United Kingdom","t":"Foundational Advance","s":19},{"id":2473,"n":"NIPER-Guwahati","c":"India","t":null,"s":13},{"id":2208,"n":"NJU-China","c":"China","t":"Therapeutics","s":16},{"id":2280,"n":"NKU_China","c":"China","t":null,"s":26},{"id":2431,"n":"NortheasternU-Boston","c":"United States","t":"Foundational Advance","s":11},{"id":2396,"n":"Northwestern","c":"United States","t":null,"s":14},{"id":2347,"n":"NPU-China","c":"China","t":"Manufacturing","s":15},{"id":2354,"n":"NTHU_Taiwan","c":"Taiwan","t":"Environment","s":20},{"id":2265,"n":"NTNU_Trondheim","c":"Norway","t":null,"s":10},{"id":2316,"n":"NTU_SINGAPORE","c":"Singapore","t":"Foundational Advance","s":13},{"id":2440,"n":"NUDT_CHINA","c":"China","t":null,"s":13},{"id":2447,"n":"NUS_Singapore","c":"Singapore","t":null,"s":10},{"id":2516,"n":"NU_Kazakhstan","c":"Kazakhstan","t":"Environment","s":7},{"id":2399,"n":"NWU-CHINA","c":"China","t":"Environment","s":15},{"id":2350,"n":"NYMU-Taipei","c":"Taiwan","t":null,"s":17},{"id":2495,"n":"NYU_Abu_Dhabi","c":"United Arab Emirates","t":null,"s":18},{"id":2400,"n":"NYU_Shanghai","c":"China","t":null,"s":10},{"id":2314,"n":"OUC-China","c":"China","t":null,"s":17},{"id":2450,"n":"Oxford","c":"United Kingdom","t":"Diagnostics","s":14},{"id":2510,"n":"Paris_Bettencourt","c":"France","t":null,"s":15},{"id":2454,"n":"PASantiago_Chile","c":"Chile","t":"High School","s":22},{"id":2198,"n":"Pasteur_Paris","c":"France","t":null,"s":19},{"id":2243,"n":"Peking","c":"China","t":"Information Processing","s":20},{"id":2456,"n":"Penn","c":"United States","t":null,"s":5},{"id":2518,"n":"Peshawar","c":"Pakistan","t":null,"s":16},{"id":2476,"n":"Pittsburgh","c":"United States","t":null,"s":12},{"id":2483,"n":"Potsdam","c":"Germany","t":"Foundational Advance","s":19},{"id":2432,"n":"Princeton","c":"United States","t":null,"s":19},{"id":2228,"n":"Purdue","c":"United States","t":null,"s":13},{"id":2484,"n":"Queens_Canada","c":"Canada","t":null,"s":15},{"id":2210,"n":"RDFZ-China","c":"China","t":"High School","s":18},{"id":2338,"n":"REC-CHENNAI","c":"India","t":null,"s":26},{"id":2390,"n":"RHIT","c":"United States","t":null,"s":13},{"id":2194,"n":"Rice","c":"United States","t":null,"s":18},{"id":2503,"n":"RPI_Troy_NY","c":"United States","t":"Therapeutics","s":16},{"id":2334,"n":"SCU-WestChina","c":"China","t":"Therapeutics","s":23},{"id":2360,"n":"SCUT-China_A","c":"China","t":"Environment","s":13},{"id":2366,"n":"SCUT-China_B","c":"China","t":"Foundational Advance","s":17},{"id":2325,"n":"SCUT-FSE-CHINA","c":"China","t":null,"s":12},{"id":2276,"n":"SCU_China","c":"China","t":null,"s":4},{"id":2239,"n":"SDSZ-China","c":"China","t":"High School","s":14},{"id":2449,"n":"SDU-Denmark","c":"Denmark","t":null,"s":17},{"id":2321,"n":"SDU_CHINA","c":"China","t":"Therapeutics","s":21},{"id":2291,"n":"SECA_NZ","c":"New Zealand","t":null,"s":9},{"id":2315,"n":"Shanghaitech","c":"China","t":null,"s":21},{"id":2508,"n":"Sheffield","c":"United Kingdom","t":null,"s":11},{"id":2200,"n":"Shenzhen_SFLS","c":"China","t":"High School","s":29},{"id":2507,"n":"SHSBNU_China","c":"China","t":"High School","s":11},{"id":2472,"n":"SIAT-SCIE","c":"China","t":"High School","s":13},{"id":2311,"n":"SiCAU-China","c":"China","t":"New Application","s":15},{"id":2285,"n":"SJTU-BioX-Shanghai","c":"China","t":null,"s":18},{"id":2211,"n":"SJTU-Software","c":"China","t":"Software","s":18},{"id":2224,"n":"SMS_Shenzhen","c":"China","t":"High School","s":25},{"id":2244,"n":"SSTi-SZGD","c":"China","t":"Environment","s":15},{"id":2485,"n":"Stanford-Brown","c":"United States","t":"Manufacturing","s":18},{"id":2235,"n":"Stockholm","c":"Sweden","t":"Therapeutics","s":28},{"id":2196,"n":"Stony_Brook","c":"United States","t":null,"s":33},{"id":2497,"n":"Stuttgart","c":"Germany","t":null,"s":16},{"id":2216,"n":"SUIS_Alpha_Shanghai","c":"China","t":"High School","s":12},{"id":2492,"n":"SUSTech_Shenzhen","c":"China","t":"Foundational Advance","s":14},{"id":2379,"n":"SVCE_CHENNAI","c":"India","t":"Foundational Advance","s":19},{"id":2417,"n":"Sydney_Australia","c":"Australia","t":"Therapeutics","s":11},{"id":2298,"n":"SYSU-CHINA","c":"China","t":null,"s":17},{"id":2214,"n":"SYSU-Software","c":"China","t":"Software","s":28},{"id":2418,"n":"Szeged_SA_RMG","c":"Hungary","t":"High School","s":12},{"id":2232,"n":"SZU-China","c":"China","t":null,"s":18},{"id":2349,"n":"Tartu_TUIT","c":"Estonia","t":null,"s":14},{"id":2229,"n":"TAS_Taipei","c":"Taiwan","t":"High School","s":28},{"id":2383,"n":"TCFSH_Taiwan","c":"Taiwan","t":"High School","s":13},{"id":2471,"n":"Tec-Chihuahua","c":"Mexico","t":null,"s":26},{"id":2246,"n":"TecCEM","c":"Mexico","t":null,"s":23},{"id":2520,"n":"TECHNION-ISRAEL","c":"Israel","t":null,"s":15},{"id":2434,"n":"TecMonterrey_GDA","c":"Mexico","t":"Environment","s":18},{"id":2408,"n":"Tel-Hai","c":"Israel","t":"Food & Nutrition","s":13},{"id":2407,"n":"Tianjin","c":"China","t":null,"s":24},{"id":2328,"n":"TJU_China","c":"China","t":"New Application","s":19},{"id":2279,"n":"TMMU-China","c":"China","t":"Foundational Advance","s":8},{"id":2496,"n":"TNCR_Korea","c":"Korea, Republic Of","t":"High School","s":14},{"id":2505,"n":"TokyoTech","c":"Japan","t":"Information Processing","s":13},{"id":2374,"n":"Tongji_China","c":"China","t":null,"s":15},{"id":2469,"n":"Toronto","c":"Canada","t":null,"s":13},{"id":2369,"n":"TP-CC_San_Diego","c":"United States","t":"High School","s":12},{"id":2247,"n":"Tsinghua","c":"China","t":null,"s":13},{"id":2250,"n":"Tsinghua-A","c":"China","t":"Information Processing","s":15},{"id":2356,"n":"TU-Eindhoven","c":"Netherlands","t":null,"s":10},{"id":2306,"n":"TUDelft","c":"Netherlands","t":null,"s":27},{"id":2372,"n":"Tuebingen","c":"Germany","t":"Therapeutics","s":15},{"id":2416,"n":"Tufts","c":"United States","t":null,"s":8},{"id":2267,"n":"TUST_China","c":"China","t":null,"s":17},{"id":2380,"n":"TU_Darmstadt","c":"Germany","t":"Manufacturing","s":24},{"id":2273,"n":"TU_Dresden","c":"Germany","t":null,"s":19},{"id":2389,"n":"UAlberta","c":"Canada","t":"Foundational Advance","s":14},{"id":2402,"n":"UBonn_HBRS","c":"Germany","t":null,"s":19},{"id":2287,"n":"UCAS","c":"China","t":"Food & Nutrition","s":19},{"id":2344,"n":"UCC_Ireland","c":"Ireland","t":null,"s":9},{"id":2428,"n":"UChicago","c":"United States","t":null,"s":5},{"id":2289,"n":"UChile_Biotec","c":"Chile","t":null,"s":18},{"id":2425,"n":"UChile_OpenBio-CeBiB","c":"Chile","t":"Environment","s":15},{"id":2332,"n":"UCL","c":"United States","t":"Foundational Advance","s":19},{"id":2341,"n":"UCLouvain","c":"Belgium","t":null,"s":14},{"id":2386,"n":"UConn","c":"United States","t":"Energy","s":23},{"id":2455,"n":"UCopenhagen","c":"Denmark","t":null,"s":18},{"id":2223,"n":"UCSC","c":"United States","t":null,"s":18},{"id":2212,"n":"UC_San_Diego","c":"United States","t":"New Application","s":9},{"id":2286,"n":"UESTC-China","c":"China","t":null,"s":21},{"id":2352,"n":"UFlorida","c":"United States","t":"Environment","s":12},{"id":2392,"n":"UGA-Georgia","c":"United States","t":null,"s":13},{"id":2424,"n":"UiOslo_Norway","c":"Norway","t":null,"s":20},{"id":2427,"n":"UIOWA","c":"United States","t":"Manufacturing","s":15},{"id":2468,"n":"UIUC_Illinois","c":"United States","t":"Foundational Advance","s":11},{"id":2215,"n":"ULaVerne_Collab","c":"United States","t":"Environment","s":10},{"id":2477,"n":"UMaryland","c":"United States","t":null,"s":22},{"id":2430,"n":"UMBC","c":"United States","t":"Environment","s":9},{"id":2236,"n":"UNBC-Canada","c":"Canada","t":"Therapeutics","s":11},{"id":2499,"n":"UNC-Asheville","c":"United States","t":"Environment","s":6},{"id":2461,"n":"UNebraska-Lincoln","c":"United States","t":"Environment","s":14},{"id":2343,"n":"UNIFI","c":"Italy","t":null,"s":18},{"id":2284,"n":"UNOTT","c":"United Kingdom","t":null,"s":15},{"id":2327,"n":"uOttawa","c":"Canada","t":null,"s":11},{"id":2504,"n":"UPMC_PARIS","c":"France","t":null,"s":22},{"id":2423,"n":"Uppsala","c":"Sweden","t":null,"s":25},{"id":2397,"n":"UrbanTundra_Edmonton","c":"Canada","t":"High School","s":17},{"id":2222,"n":"USMA-West_Point","c":"United States","t":"Diagnostics","s":16},{"id":2199,"n":"USNA_Annapolis","c":"United States","t":null,"s":14},{"id":2486,"n":"USP-Brazil","c":"Brazil","t":"New Application","s":22},{"id":2242,"n":"USTC","c":"China","t":"Manufacturing","s":34},{"id":2241,"n":"USTC-Software","c":"China","t":"Software","s":45},{"id":2519,"n":"UST_Beijing","c":"China","t":"Food & Nutrition","s":39},{"id":2522,"n":"US_AFRL_CarrollHS","c":"United States","t":"High School","s":20},{"id":2451,"n":"UT-Knoxville","c":"United States","t":null,"s":16},{"id":2351,"n":"Utrecht","c":"Netherlands","t":"Diagnostics","s":20},{"id":2490,"n":"U_of_Guelph","c":"Canada","t":null,"s":7},{"id":2269,"n":"Valencia_UPV","c":"Spain","t":null,"s":22},{"id":2259,"n":"Vilnius-Lithuania","c":"Lithuania","t":null,"s":15},{"id":2272,"n":"Virginia","c":"United States","t":"Environment","s":10},{"id":2387,"n":"Wageningen_UR","c":"Netherlands","t":null,"s":19},{"id":2463,"n":"Warwick","c":"United Kingdom","t":null,"s":12},{"id":2391,"n":"Washington","c":"United States","t":null,"s":39},{"id":2195,"n":"WashU_StLouis","c":"United States","t":null,"s":9},{"id":2475,"n":"Waterloo","c":"Canada","t":null,"s":21},{"id":2420,"n":"Westminster_UK","c":"United Kingdom","t":"Therapeutics","s":17},{"id":2462,"n":"WHU-China","c":"China","t":"Environment","s":26},{"id":2333,"n":"William_and_Mary","c":"United States","t":null,"s":12},{"id":2452,"n":"WLC-Milwaukee","c":"United States","t":null,"s":7},{"id":2513,"n":"Worldshaper-Nanjing","c":"China","t":"High School","s":16},{"id":2514,"n":"Worldshaper-Wuhan","c":"China","t":"High School","s":10},{"id":2512,"n":"Worldshaper-XSHS","c":"China","t":"High School","s":14},{"id":2413,"n":"WPI_Worcester","c":"United States","t":null,"s":8},{"id":2309,"n":"XJTLU-CHINA","c":"China","t":"Therapeutics","s":16},{"id":2310,"n":"XMU-China","c":"China","t":"Environment","s":29},{"id":2489,"n":"York","c":"United Kingdom","t":null,"s":18},{"id":2207,"n":"ZJU-China","c":"China","t":null,"s":17},{"id":2277,"n":"ZJUT-China","c":"China","t":null,"s":25}];

const handlers = {
	'LaunchRequest': function() {
		this.emit(':ask', 'Hi, I\'m Synthetic Biology. Would you like to lookup a part or search protocols?', 'Sorry, I didn\'t get that. Do you want to search the iGEM registry for a part or search Protocat for protocols?');
	},
	'SearchPartsRegistry': function() {
		this.emit('GetPart');
	},
	'SearchTeams': function() {
		this.emit('GetTeam');
	},
	'ProtocolStepNext': function() {
		this.emit('ProtocolStepByStepMove', 1);
	},
	'ProtocolStepRepeat': function() {
		this.emit('ProtocolStepByStepMove', 0);
	},
	'ProtocolStepBack': function() {
		this.emit('ProtocolStepByStepMove', -1);
	},
	'GetPart': function() {
		// Check we have a part ID in slot
		if (!this.event.request.intent.slots.igempartnameslot.value) {
			this.emit(':elicitSlot', 'igempartnameslot', 'Sure. What\'s the part ID?', 'What\'s the iGEM Registry part ID?');
		} else {
			let url = 'https://parts.igem.org/cgi/xml/part.cgi?part=' + this.event.request.intent.slots.igempartnameslot.value.replace(' ', '');
			let self = this;

			getData(url, 'xml', function(data) {
				// Check API responded with a part
				if (!data.rsbpml.part_list[0].part) {
					self.emit(':tell', 'Sorry, I couldn\'t find that part in the registry.');
				} else {
					let part = data.rsbpml.part_list[0].part[0];

					// There's a lot of use of ternary operators to check if a piece of
					// data exists, as data is not guaranteed for every part.
					let title = 'Part ' + part.part_name[0] + (part.part_nickname[0] ? ' (' + part.part_nickname[0] + ')' : '');

					let speech = '';
					speech += 'Part ' + part.part_short_name[0] + ' ';
					speech += (part.part_type[0] ? 'is a ' + part.part_type[0] : '');
					speech += (part.part_results[0] == "Works" ? ' that works' : '');
					speech += (part.part_author[0] ? ', designed by ' + part.part_author[0].clean() + '.' : '.');

					let text = '';
					text += (part.part_type[0] ? 'Type: ' + part.part_type[0] + '  \n' : '');
					text += (part.part_short_desc[0] ? 'Desc: ' + part.part_short_desc[0] + '  \n' : '');
					text += (part.part_results[0] ? 'Results: ' + part.part_results[0] + '  \n' : '');
					text += (part.release_status[0] ? 'Release status: ' + part.release_status[0] + '  \n' : '');
					text += (part.sample_status[0] ? 'Availability: ' + part.sample_status[0] + '  \n' : '');
					// Tidies the author field; trims excess whitespace and remove fullstop, if present.
					text += (part.part_author[0] ? 'Designed by: ' + part.part_author[0].clean() + '  \n' : '');
					text += '  \nData provided by the iGEM registry';

					self.emit(':tellWithCard', speech, title, text);
				}
			});
		}
	},
	'GetTeam': function() {
		if (!this.event.request.intent.slots.igemteamnameslot.value) {
			this.emit(':elicitSlot', 'igemteamnameslot', 'Sure. What\'s the team name?', 'What\'s the iGEM team name, exactly as it appears on the team list?');
		} else {
            let fuseJs = require('fuse.js');
            let searchOptions = {
                shouldSort: true,
                threshold: 0.4,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 2,
                keys: ["n"]
            };
            let team = (new fuseJs(teamData, searchOptions)).search(this.event.request.intent.slots.igemteamnameslot.value)[0];

            if(team) {
                let title = 'Team ' + team.n.replace(/[-_]/g, ' ');

                let speech = title + ' is an iGEM team from ' + team.c;
                speech += (team.t ? ' on the ' + team.t + ' track. ' : '. ');
                speech += (team.s ? 'They have ' + team.s + ' team mebers.' : '');

                let text = '';
                text += (team.n ? 'Name: ' + team.n + '  \n' : '');
                text += (team.c ? 'Country: ' + team.c.replace('the ', '') + '  \n' : '');
                text += (team.t ? 'Track: ' + team.t + '  \n' : '');
                text += (team.s ? '# Members: ' + team.s + '  \n' : '');

                text += '  \nData sourced from iGEM';

                this.emit(':tellWithCard', speech, title, text);
            } else {
                this.emit(':tell', 'Sorry, I couldn\'t find team ' + this.event.request.intent.slots.igemteamnameslot.value);
            }
		}
	},
	'ProtocatSearch': function() {
		if (!this.event.request.intent.slots.query.value) {
			this.emit(':ask', 'query', 'Ok. What protocol are you looking for?', 'Sorry, I didn\'t get that. For example you could ask for a ligation protocol. What synthetic biology protocol are you looking for?');
		} else {
			let url = 'https://protocat.org/api/protocol/?format=json';

			let self = this;

			getData(url, 'JSON', (data) => {
				// Use fuse.js to fuzzy-search through protcols by title
				// Uses var to load globally
				var fuseJs = require('fuse.js');
				let searchOptions = {
					shouldSort: true,
					threshold: 0.4,
					location: 0,
					distance: 100,
					maxPatternLength: 32,
					minMatchCharLength: 2,
					keys: ["title"]
				};
				let results = (new fuseJs(data, searchOptions)).search(self.event.request.intent.slots.query.value);

				if (results.length == 0) {
					// No protocols found
					let speech = 'I couldn\'t find any protocols matching your query on Protocat.';
					self.emit(':tell', speech);
				} else {
					self.emit('ShowProtocol', results[0]);
				}
			});
		}
	},
	'ShowProtocol': function(protocol) {
		// There's a lot of use of ternary operators to check if a piece of
		// data exists, as data is not guaranteed for every protocol.

		let title = protocol.title;
		let speech = '';
		speech += 'Ok, I\'ve found ' + protocol.title.clean() + '. ';
		speech += (protocol.description ? protocol.description.clean().split('.')[0] + '. ' : '');
		speech += 'Do you want a step-by-step guide or to exit?';

		let reprompt = 'Do you want a step-by-step guide or to exit?';

		let text = '';
		text += (protocol.description.clean() ? 'Description: ' + protocol.description.clean() + '  \n' : '');
		text += (protocol.materials.clean() ? 'Materials: ' + protocol.materials.clean() + '  \n' : '');
		text += (protocol.protocol_steps ? '# Steps: ' + protocol.protocol_steps.length + '  \n' : '');
		text += '  \nData provided by Protocat';

		this.attributes['protocol'] = protocol;
		this.emit(':askWithCard', speech, reprompt, title, text);
	},
	'ProtocolBeginStepByStep': function() {
		let protocol = (this.attributes['protocol'] ? this.attributes['protocol'] : {});
		if (protocol.protocol_steps) {
			let speech = 'Sure. Beginning the step-by-step instructions for ' + protocol.title + '. ';
			speech += 'To navigate through steps, just say \'next\', \'repeat\', or \'back\'. ';
			speech += (protocol.protocol_steps[0].warning.clean() ? 'Warning for step 1: ' + protocol.protocol_steps[0].warning.clean() + '.  \n  \n' : '');
			speech += 'Step 1: ' + protocol.protocol_steps[0].action.clean() + '. ';
			speech += 'Do you want to go to the next step or repeat this one?';

			let reprompt = 'Do you want to go to the next step or repeat this one?';

			let title = 'Step 1';

			let text = (protocol.protocol_steps[0].warning.clean() ? 'Warning for step 1: ' + protocol.protocol_steps[0].warning.clean() + '. ' : '');
			text += 'Step 1: ' + protocol.protocol_steps[0].action.clean();

			// currentStep is 0 indexed, so steps[currentStep] works
			let protocol_step_state = {
				"steps": protocol.protocol_steps,
				"currentStep": 0,
				"id": protocol.id
			};
			this.attributes['protocol_step_state'] = protocol_step_state;

			this.emit(':askWithCard', speech, reprompt, title, text);
		} else {
			this.emit(':tell', 'You need to search for a protocol before getting instructions for it.');
		}
	},
	'ProtocolStepByStepMove': function(stepChange) {
		let protocol_step_state = (this.attributes['protocol_step_state'] ? this.attributes['protocol_step_state'] : {});

		if (typeof protocol_step_state.currentStep == 'number') {
			let newCurrentStep = protocol_step_state.currentStep + stepChange;
			if (newCurrentStep > protocol_step_state.steps.length - 1) {
				// End instructions
				this.attributes['protocol_step_state'] = protocol_step_state;
				this.emit(':ask', 'There are no more steps in this guide. Do you want to quit or have me repeat the last step?');
			} else if (newCurrentStep < 0) {
				// Not allowed to go back
				this.attributes['protocol_step_state'] = protocol_step_state;
				this.emit(':ask', 'You can\'t go back further than step 1! Do you want to repeat step 1 or move on to step 2?', 'I didn\'t get that - Should I repeat step 1 or move on to step 2?');
			} else {
				// Valid move
				protocol_step_state.currentStep = newCurrentStep;
				this.emit('ProtocolStepByStepShow', protocol_step_state);
			}
		} else {
			if (this.attributes['protocol'] ? this.attributes['protocol'] : false) {
				this.emit('ProtocolBeginStepByStep');
			} else {
				this.emit(':tell', 'You need to search for a protocol before getting instructions for it.');
			}
		}
	},
	'ProtocolStepByStepShow': function(protocol_step_state) {
		let step = protocol_step_state.steps[protocol_step_state.currentStep];

		let title = 'Step ' + step.step_number.toString();

		let speech = title + '. ';
		speech += (step.warning.clean() ? 'Warning: ' + step.warning.clean() + '. ' : '');
		// Regex replaces 'u' used to mean micro with actual micro
		speech += step.action.clean().replace(/([0-9]+)\s*u([lLg])+s*/g, '$1μ$2') + '. ';
		speech += 'Next step or repeat this one?';

		let reprompt = 'Do you want to go to the next step or repeat this one?';

		let text = '';
		text += (step.warning.clean() ? 'Warning: ' + step.warning.clean() + '.  \n  \n' : '');
		text += step.action.clean().replace(/([0-9]+)\s*u([lLg])+s*/g, '$1μ$2');

		this.attributes['protocol_step_state'] = protocol_step_state;
		this.emit(':askWithCard', speech, reprompt, title, text);
	},
	'AMAZON.HelpIntent': function() {
		this.emit('LaunchRequest');
	},
	'AMAZON.CancelIntent': function() {
		this.emit(':tell', 'Ok, Bye!');
	},
	'AMAZON.StopIntent': function() {
		this.emit(':tell', 'Ok, Bye!');
	},
	'SessionEndedRequest': function() {
		this.emit(':saveState', true);
	},
	'Unhandled': function() {
		this.emit(':ask', 'Sorry, I didn\'t get that. Please can you repeat it?', 'Sorry, what was that?');
	}
};

// Gets data from a HTTP(S) source. Currently supports 'JSON' and 'xml' parsing.
function getData(url, parser, callback) {
	let requester = https;
	if (url.indexOf('http://') > -1) {
		requester = require('http');
	}
	requester.get(url, (res) => {
		let data = '';
		if (parser == 'xml') {
			// If we know it's xml, we can load the library in advance for a
			// minor performance improvement. Uses var so it's defined globally
			var parseXml = require('xml2js').parseString;
		}

		res.on('data', (chunk) => {
			data += chunk;
		});

		res.on('end', () => {
			if (parser == 'JSON') {
				callback(JSON.parse(data));
			} else if (parser == 'xml') {
				parseXml(data, function(err, result) {
					callback(result);
				});
			} else {
				throw new Error('Unknown parser type');
			}
		});
	}).on('error', (err) => {
		console.log('Error getting data: ', err);
		this.emit(':tell', 'There was an error connecting to the database. Please try again later.');
	});
}

// Removes HTML tags, removes whitespace around string, removes trailing full stop
String.prototype.clean = function() {
	return this.replace(/<(?:.|\n)*?>/g, '').trim().replace(/\.$/, "");
};

exports.handler = function(event, context) {
	const alexa = Alexa.handler(event, context);
	alexa.appId = process.env.APP_ID;
	alexa.registerHandlers(handlers);
	alexa.execute();
};
