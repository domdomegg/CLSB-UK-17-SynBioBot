'use strict';

// Set up dependencies
const ApiAiApp = require('actions-on-google').ApiAiApp;
const functions = require('firebase-functions');
const https = require('https');

const teamData = {"2194":{"n":"Rice","c":"the United States","t":null,"s":18},"2195":{"n":"WashU_StLouis","c":"the United States","t":null,"s":9},"2196":{"n":"Stony_Brook","c":"the United States","t":null,"s":33},"2197":{"n":"Hong_Kong_UCCKE","c":"Hong Kong","t":"High School","s":19},"2198":{"n":"Pasteur_Paris","c":"France","t":null,"s":19},"2199":{"n":"USNA_Annapolis","c":"the United States","t":null,"s":14},"2200":{"n":"Shenzhen_SFLS","c":"China","t":"High School","s":29},"2201":{"n":"Bielefeld-CeBiTec","c":"Germany","t":"Foundational Advance","s":19},"2202":{"n":"Hong_Kong_HKU","c":"Hong Kong","t":"Diagnostics","s":20},"2203":{"n":"EPFL","c":"Switzerland","t":"Diagnostics","s":16},"2204":{"n":"CSU_Fort_Collins","c":"the United States","t":null,"s":6},"2205":{"n":"Newcastle","c":"the United Kingdom","t":"Foundational Advance","s":19},"2206":{"n":"CLSB-UK","c":"the United Kingdom","t":"High School","s":20},"2207":{"n":"ZJU-China","c":"China","t":null,"s":17},"2208":{"n":"NJU-China","c":"China","t":"Therapeutics","s":16},"2209":{"n":"Nanjing_NFLS","c":"China","t":"High School","s":19},"2210":{"n":"RDFZ-China","c":"China","t":"High School","s":18},"2211":{"n":"SJTU-Software","c":"China","t":"Software","s":18},"2212":{"n":"UC_San_Diego","c":"the United States","t":"New Application","s":9},"2213":{"n":"Manchester","c":"the United Kingdom","t":"Environment","s":13},"2214":{"n":"SYSU-Software","c":"China","t":"Software","s":28},"2215":{"n":"ULaVerne_Collab","c":"the United States","t":"Environment","s":10},"2216":{"n":"SUIS_Alpha_Shanghai","c":"China","t":"High School","s":12},"2217":{"n":"AFCM-Egypt","c":"Egypt","t":"Therapeutics","s":22},"2219":{"n":"HK_SKHLPSS","c":"Hong Kong","t":"High School","s":19},"2220":{"n":"BNU-China","c":"China","t":null,"s":26},"2221":{"n":"Gaston_Day_School","c":"the United States","t":null,"s":9},"2222":{"n":"USMA-West_Point","c":"the United States","t":"Diagnostics","s":16},"2223":{"n":"UCSC","c":"the United States","t":null,"s":18},"2224":{"n":"SMS_Shenzhen","c":"China","t":"High School","s":25},"2225":{"n":"Aachen","c":"Germany","t":null,"s":20},"2226":{"n":"ASIJ_TOKYO","c":"Japan","t":"High School","s":22},"2228":{"n":"Purdue","c":"the United States","t":null,"s":13},"2229":{"n":"TAS_Taipei","c":"Taiwan","t":"High School","s":28},"2230":{"n":"Mingdao","c":"Taiwan","t":"High School","s":20},"2232":{"n":"SZU-China","c":"China","t":null,"s":18},"2233":{"n":"Kobe","c":"Japan","t":"Food & Nutrition","s":11},"2234":{"n":"Bilkent-UNAMBG","c":"Turkey","t":"Diagnostics","s":12},"2235":{"n":"Stockholm","c":"Sweden","t":"Therapeutics","s":28},"2236":{"n":"UNBC-Canada","c":"Canada","t":"Therapeutics","s":11},"2238":{"n":"ManhattanCol_Bronx","c":"the United States","t":null,"s":16},"2239":{"n":"SDSZ-China","c":"China","t":"High School","s":14},"2240":{"n":"Hong_Kong_HKUST","c":"Hong Kong","t":"Foundational Advance","s":32},"2241":{"n":"USTC-Software","c":"China","t":"Software","s":45},"2242":{"n":"USTC","c":"China","t":"Manufacturing","s":34},"2243":{"n":"Peking","c":"China","t":"Information Processing","s":20},"2244":{"n":"SSTi-SZGD","c":"China","t":"Environment","s":15},"2245":{"n":"Judd_UK","c":"the United Kingdom","t":"High School","s":17},"2246":{"n":"TecCEM","c":"Mexico","t":null,"s":23},"2247":{"n":"Tsinghua","c":"China","t":null,"s":13},"2248":{"n":"Cadets2Vets","c":"the United States","t":"Environment","s":19},"2249":{"n":"CU-Boulder","c":"the United States","t":null,"s":13},"2250":{"n":"Tsinghua-A","c":"China","t":"Information Processing","s":15},"2251":{"n":"Harvard","c":"the United States","t":null,"s":8},"2252":{"n":"AshesiGhana","c":"Ghana","t":"Environment","s":11},"2253":{"n":"Austin_UTexas","c":"the United States","t":null,"s":15},"2254":{"n":"Hong_Kong-CUHK","c":"Hong Kong","t":null,"s":19},"2255":{"n":"Aix-Marseille","c":"France","t":"Environment","s":44},"2256":{"n":"Nagahama","c":"Japan","t":null,"s":9},"2257":{"n":"Nanjing-China","c":"China","t":null,"s":18},"2258":{"n":"IISER-Pune-India","c":"India","t":"Diagnostics","s":13},"2259":{"n":"Vilnius-Lithuania","c":"Lithuania","t":null,"s":15},"2260":{"n":"Calgary","c":"Canada","t":null,"s":31},"2262":{"n":"NCTU_Formosa","c":"Taiwan","t":null,"s":24},"2263":{"n":"KU_Leuven","c":"Belgium","t":"New Application","s":16},"2265":{"n":"NTNU_Trondheim","c":"Norway","t":null,"s":10},"2266":{"n":"Lund","c":"Sweden","t":"Environment","s":14},"2267":{"n":"TUST_China","c":"China","t":null,"s":17},"2268":{"n":"Kingsborough_NY","c":"the United States","t":null,"s":12},"2269":{"n":"Valencia_UPV","c":"Spain","t":null,"s":22},"2270":{"n":"AQA_Unesp","c":"Brazil","t":"Therapeutics","s":17},"2271":{"n":"Cologne-Duesseldorf","c":"Germany","t":"Foundational Advance","s":29},"2272":{"n":"Virginia","c":"the United States","t":"Environment","s":10},"2273":{"n":"TU_Dresden","c":"Germany","t":null,"s":19},"2274":{"n":"Michigan_Software","c":"the United States","t":"Software","s":22},"2275":{"n":"NCKU_Tainan","c":"Taiwan","t":"Environment","s":22},"2276":{"n":"SCU_China","c":"China","t":null,"s":4},"2277":{"n":"ZJUT-China","c":"China","t":null,"s":25},"2278":{"n":"INSA-UPS_France","c":"France","t":null,"s":21},"2279":{"n":"TMMU-China","c":"China","t":"Foundational Advance","s":8},"2280":{"n":"NKU_China","c":"China","t":null,"s":26},"2281":{"n":"CIEI-BJ","c":"China","t":"High School","s":17},"2282":{"n":"IONIS-PARIS","c":"France","t":null,"s":23},"2284":{"n":"UNOTT","c":"the United Kingdom","t":null,"s":15},"2285":{"n":"SJTU-BioX-Shanghai","c":"China","t":null,"s":18},"2286":{"n":"UESTC-China","c":"China","t":null,"s":21},"2287":{"n":"UCAS","c":"China","t":"Food & Nutrition","s":19},"2288":{"n":"NEU-China","c":"China","t":null,"s":12},"2289":{"n":"UChile_Biotec","c":"Chile","t":null,"s":18},"2290":{"n":"East_Chapel_Hill","c":"the United States","t":"High School","s":13},"2291":{"n":"SECA_NZ","c":"New Zealand","t":null,"s":9},"2292":{"n":"CCU_Taiwan","c":"Taiwan","t":null,"s":24},"2293":{"n":"Bristol","c":"the United Kingdom","t":null,"s":14},"2294":{"n":"BOKU-Vienna","c":"Austria","t":"Foundational Advance","s":22},"2295":{"n":"Freiburg","c":"Germany","t":"Therapeutics","s":22},"2296":{"n":"Cornell","c":"the United States","t":null,"s":32},"2298":{"n":"SYSU-CHINA","c":"China","t":null,"s":17},"2299":{"n":"Grenoble-Alpes","c":"France","t":null,"s":14},"2300":{"n":"Macquarie_Australia","c":"Australia","t":"Energy","s":18},"2301":{"n":"Michigan","c":"the United States","t":null,"s":17},"2302":{"n":"NEFU_China","c":"China","t":null,"s":3},"2304":{"n":"HBUT-China","c":"China","t":"Environment","s":23},"2305":{"n":"BIT","c":"China","t":"Diagnostics","s":35},"2306":{"n":"TUDelft","c":"Netherlands","t":null,"s":27},"2307":{"n":"Bordeaux","c":"France","t":null,"s":24},"2308":{"n":"ECUST","c":"China","t":"Energy","s":21},"2309":{"n":"XJTLU-CHINA","c":"China","t":"Therapeutics","s":16},"2310":{"n":"XMU-China","c":"China","t":"Environment","s":29},"2311":{"n":"SiCAU-China","c":"China","t":"New Application","s":15},"2314":{"n":"OUC-China","c":"China","t":null,"s":17},"2315":{"n":"Shanghaitech","c":"China","t":null,"s":21},"2316":{"n":"NTU_SINGAPORE","c":"Singapore","t":"Foundational Advance","s":13},"2317":{"n":"Jilin_China","c":"China","t":"Environment","s":23},"2318":{"n":"IIT-Madras","c":"India","t":null,"s":19},"2319":{"n":"IISc-Bangalore","c":"India","t":null,"s":25},"2320":{"n":"IISER-Mohali-INDIA","c":"India","t":null,"s":10},"2321":{"n":"SDU_CHINA","c":"China","t":"Therapeutics","s":21},"2322":{"n":"CIEI-China","c":"China","t":"High School","s":17},"2323":{"n":"Munich","c":"Germany","t":null,"s":22},"2324":{"n":"Exeter","c":"the United Kingdom","t":null,"s":19},"2325":{"n":"SCUT-FSE-CHINA","c":"China","t":null,"s":12},"2326":{"n":"BNDS_China","c":"China","t":"High School","s":14},"2327":{"n":"uOttawa","c":"Canada","t":null,"s":11},"2328":{"n":"TJU_China","c":"China","t":"New Application","s":19},"2329":{"n":"Chalmers-Gothenburg","c":"Sweden","t":"Diagnostics","s":15},"2330":{"n":"Edinburgh_OG","c":"the United Kingdom","t":null,"s":13},"2331":{"n":"Dalhousie","c":"Canada","t":null,"s":21},"2332":{"n":"UCL","c":"the United States","t":"Foundational Advance","s":19},"2333":{"n":"William_and_Mary","c":"the United States","t":null,"s":12},"2334":{"n":"SCU-WestChina","c":"China","t":"Therapeutics","s":23},"2335":{"n":"KAIT_JAPAN","c":"Japan","t":null,"s":11},"2336":{"n":"HUST-China","c":"China","t":null,"s":6},"2337":{"n":"Botchan_Lab_Tokyo","c":"Japan","t":null,"s":12},"2338":{"n":"REC-CHENNAI","c":"India","t":null,"s":26},"2340":{"n":"Kent","c":"the United Kingdom","t":null,"s":13},"2341":{"n":"UCLouvain","c":"Belgium","t":null,"s":14},"2342":{"n":"Aalto-Helsinki","c":"Finland","t":"Manufacturing","s":13},"2343":{"n":"UNIFI","c":"Italy","t":null,"s":18},"2344":{"n":"UCC_Ireland","c":"Ireland","t":null,"s":9},"2346":{"n":"HFLS_H2Z_Hangzhou","c":"China","t":"High School","s":15},"2347":{"n":"NPU-China","c":"China","t":"Manufacturing","s":15},"2348":{"n":"NAWI_Graz","c":"Austria","t":"Information Processing","s":19},"2349":{"n":"Tartu_TUIT","c":"Estonia","t":null,"s":14},"2350":{"n":"NYMU-Taipei","c":"Taiwan","t":null,"s":17},"2351":{"n":"Utrecht","c":"Netherlands","t":"Diagnostics","s":20},"2352":{"n":"UFlorida","c":"the United States","t":"Environment","s":12},"2353":{"n":"Lambert_GA","c":"the United States","t":"High School","s":13},"2354":{"n":"NTHU_Taiwan","c":"Taiwan","t":"Environment","s":20},"2355":{"n":"DTU-Denmark","c":"Denmark","t":null,"s":15},"2356":{"n":"TU-Eindhoven","c":"Netherlands","t":null,"s":10},"2357":{"n":"Arizona_State","c":"the United States","t":"Information Processing","s":10},"2358":{"n":"JNFLS","c":"China","t":"High School","s":18},"2360":{"n":"SCUT-China_A","c":"China","t":"Environment","s":13},"2361":{"n":"Groningen","c":"Netherlands","t":"Food & Nutrition","s":17},"2362":{"n":"Missouri_Rolla","c":"the United States","t":"Environment","s":5},"2363":{"n":"iTesla-SoundBio","c":"the United States","t":"Environment","s":22},"2364":{"n":"Greece","c":"Greece","t":null,"s":21},"2365":{"n":"NAU-CHINA","c":"China","t":"Food & Nutrition","s":28},"2366":{"n":"SCUT-China_B","c":"China","t":"Foundational Advance","s":17},"2367":{"n":"FSU","c":"the United States","t":"Therapeutics","s":15},"2368":{"n":"BIT-China","c":"China","t":"Food & Nutrition","s":26},"2369":{"n":"TP-CC_San_Diego","c":"the United States","t":"High School","s":12},"2371":{"n":"BGIC-Union","c":"China","t":"High School","s":14},"2372":{"n":"Tuebingen","c":"Germany","t":"Therapeutics","s":15},"2374":{"n":"Tongji_China","c":"China","t":null,"s":15},"2375":{"n":"Minnesota","c":"the United States","t":null,"s":14},"2376":{"n":"CGU_Taiwan","c":"Taiwan","t":null,"s":17},"2377":{"n":"Lanzhou","c":"China","t":"Environment","s":18},"2378":{"n":"ITB_Indonesia","c":"Indonesia","t":"Energy","s":19},"2379":{"n":"SVCE_CHENNAI","c":"India","t":"Foundational Advance","s":19},"2380":{"n":"TU_Darmstadt","c":"Germany","t":"Manufacturing","s":24},"2381":{"n":"HZAU-China","c":"China","t":"Foundational Advance","s":19},"2382":{"n":"CSMU_NCHU_Taiwan","c":"Taiwan","t":null,"s":15},"2383":{"n":"TCFSH_Taiwan","c":"Taiwan","t":"High School","s":13},"2384":{"n":"FAFU-CHINA","c":"China","t":null,"s":27},"2385":{"n":"Amsterdam","c":"Netherlands","t":"Manufacturing","s":12},"2386":{"n":"UConn","c":"the United States","t":"Energy","s":23},"2387":{"n":"Wageningen_UR","c":"Netherlands","t":null,"s":19},"2389":{"n":"UAlberta","c":"Canada","t":"Foundational Advance","s":14},"2390":{"n":"RHIT","c":"the United States","t":null,"s":13},"2391":{"n":"Washington","c":"the United States","t":null,"s":39},"2392":{"n":"UGA-Georgia","c":"the United States","t":null,"s":13},"2395":{"n":"Melbourne","c":"Australia","t":null,"s":11},"2396":{"n":"Northwestern","c":"the United States","t":null,"s":14},"2397":{"n":"UrbanTundra_Edmonton","c":"Canada","t":"High School","s":17},"2398":{"n":"Heidelberg","c":"Germany","t":"Foundational Advance","s":20},"2399":{"n":"NWU-CHINA","c":"China","t":"Environment","s":15},"2400":{"n":"NYU_Shanghai","c":"China","t":null,"s":10},"2401":{"n":"Hamburg","c":"Germany","t":"Therapeutics","s":27},"2402":{"n":"UBonn_HBRS","c":"Germany","t":null,"s":19},"2403":{"n":"Kyoto","c":"Japan","t":null,"s":8},"2404":{"n":"Cardiff_Wales","c":"the United Kingdom","t":null,"s":12},"2405":{"n":"MSU-Michigan","c":"the United States","t":"Environment","s":9},"2406":{"n":"Edinburgh_UG","c":"the United Kingdom","t":null,"s":13},"2407":{"n":"Tianjin","c":"China","t":null,"s":24},"2408":{"n":"Tel-Hai","c":"Israel","t":"Food & Nutrition","s":13},"2409":{"n":"BostonU_HW","c":"the United States","t":"Hardware","s":9},"2410":{"n":"Delgado-Ivy-Marin","c":"the United States","t":null,"s":9},"2411":{"n":"BostonU","c":"the United States","t":null,"s":12},"2412":{"n":"ColumbiaNYC","c":"the United States","t":null,"s":10},"2413":{"n":"WPI_Worcester","c":"the United States","t":null,"s":8},"2414":{"n":"HokkaidoU_Japan","c":"Japan","t":null,"s":6},"2415":{"n":"GZHS-United","c":"China","t":"High School","s":11},"2416":{"n":"Tufts","c":"the United States","t":null,"s":8},"2417":{"n":"Sydney_Australia","c":"Australia","t":"Therapeutics","s":11},"2418":{"n":"Szeged_SA_RMG","c":"Hungary","t":"High School","s":12},"2419":{"n":"Franconia","c":"Germany","t":null,"s":39},"2420":{"n":"Westminster_UK","c":"the United Kingdom","t":"Therapeutics","s":17},"2423":{"n":"Uppsala","c":"Sweden","t":null,"s":25},"2424":{"n":"UiOslo_Norway","c":"Norway","t":null,"s":20},"2425":{"n":"UChile_OpenBio-CeBiB","c":"Chile","t":"Environment","s":15},"2427":{"n":"UIOWA","c":"the United States","t":"Manufacturing","s":15},"2428":{"n":"UChicago","c":"the United States","t":null,"s":5},"2429":{"n":"MIT","c":"the United States","t":null,"s":13},"2430":{"n":"UMBC","c":"the United States","t":"Environment","s":9},"2431":{"n":"NortheasternU-Boston","c":"the United States","t":"Foundational Advance","s":11},"2432":{"n":"Princeton","c":"the United States","t":null,"s":19},"2433":{"n":"British_Columbia","c":"Canada","t":null,"s":14},"2434":{"n":"TecMonterrey_GDA","c":"Mexico","t":"Environment","s":18},"2435":{"n":"Dartmouth","c":"the United States","t":null,"s":9},"2436":{"n":"Baltimore_Bio-Crew","c":"the United States","t":"High School","s":13},"2437":{"n":"KUAS_Korea","c":"the Republic Of Korea","t":null,"s":10},"2438":{"n":"Gifu","c":"Japan","t":null,"s":17},"2440":{"n":"NUDT_CHINA","c":"China","t":null,"s":13},"2441":{"n":"DEIAGRA","c":"India","t":"Environment","s":11},"2442":{"n":"Glasgow","c":"the United Kingdom","t":null,"s":15},"2443":{"n":"Lethbridge","c":"Canada","t":null,"s":24},"2444":{"n":"Delaware","c":"the United States","t":"Therapeutics","s":13},"2446":{"n":"Fudan","c":"China","t":"Information Processing","s":12},"2447":{"n":"NUS_Singapore","c":"Singapore","t":null,"s":10},"2448":{"n":"Evry_Paris-Saclay","c":"France","t":null,"s":7},"2449":{"n":"SDU-Denmark","c":"Denmark","t":null,"s":17},"2450":{"n":"Oxford","c":"the United Kingdom","t":"Diagnostics","s":14},"2451":{"n":"UT-Knoxville","c":"the United States","t":null,"s":16},"2452":{"n":"WLC-Milwaukee","c":"the United States","t":null,"s":7},"2454":{"n":"PASantiago_Chile","c":"Chile","t":"High School","s":22},"2455":{"n":"UCopenhagen","c":"Denmark","t":null,"s":18},"2456":{"n":"Penn","c":"the United States","t":null,"s":5},"2457":{"n":"Amazonas_Brazil","c":"Brazil","t":"Foundational Advance","s":25},"2458":{"n":"Austin_UTexas_LASA","c":"the United States","t":"High School","s":15},"2459":{"n":"AHUT_China","c":"the United States","t":"Information Processing","s":23},"2460":{"n":"Fudan_China","c":"China","t":"Information Processing","s":10},"2461":{"n":"UNebraska-Lincoln","c":"the United States","t":"Environment","s":14},"2462":{"n":"WHU-China","c":"China","t":"Environment","s":26},"2463":{"n":"Warwick","c":"the United Kingdom","t":null,"s":12},"2464":{"n":"Duke","c":"the United States","t":null,"s":7},"2465":{"n":"CAPS_Kansas","c":"the United States","t":"High School","s":3},"2466":{"n":"HFUT-China","c":"China","t":"Software","s":20},"2467":{"n":"CMUQ","c":"Qatar","t":"Environment","s":11},"2468":{"n":"UIUC_Illinois","c":"the United States","t":"Foundational Advance","s":11},"2469":{"n":"Toronto","c":"Canada","t":null,"s":13},"2470":{"n":"McMasterU","c":"Canada","t":null,"s":31},"2471":{"n":"Tec-Chihuahua","c":"Mexico","t":null,"s":26},"2472":{"n":"SIAT-SCIE","c":"China","t":"High School","s":13},"2473":{"n":"NIPER-Guwahati","c":"India","t":null,"s":13},"2474":{"n":"Linkoping_Sweden","c":"Sweden","t":null,"s":14},"2475":{"n":"Waterloo","c":"Canada","t":null,"s":21},"2476":{"n":"Pittsburgh","c":"the United States","t":null,"s":12},"2477":{"n":"UMaryland","c":"the United States","t":null,"s":22},"2478":{"n":"LUBBOCK_TTU","c":"the United States","t":null,"s":18},"2479":{"n":"ICT-Mumbai","c":"India","t":"Environment","s":7},"2481":{"n":"Lethbridge_HS","c":"Canada","t":"High School","s":17},"2482":{"n":"Berlin_diagnostX","c":"Germany","t":null,"s":10},"2483":{"n":"Potsdam","c":"Germany","t":"Foundational Advance","s":19},"2484":{"n":"Queens_Canada","c":"Canada","t":null,"s":15},"2485":{"n":"Stanford-Brown","c":"the United States","t":"Manufacturing","s":18},"2486":{"n":"USP-Brazil","c":"Brazil","t":"New Application","s":22},"2487":{"n":"Emory","c":"the United States","t":null,"s":15},"2488":{"n":"Moscow_RF","c":"Russian Federation","t":null,"s":11},"2489":{"n":"York","c":"the United Kingdom","t":null,"s":18},"2490":{"n":"U_of_Guelph","c":"Canada","t":null,"s":7},"2491":{"n":"CCA_San_Diego","c":"the United States","t":"High School","s":24},"2492":{"n":"SUSTech_Shenzhen","c":"China","t":"Foundational Advance","s":14},"2493":{"n":"McMaster_II","c":"Canada","t":null,"s":12},"2495":{"n":"NYU_Abu_Dhabi","c":"United Arab Emirates","t":null,"s":18},"2496":{"n":"TNCR_Korea","c":"Korea, Republic Of","t":"High School","s":14},"2497":{"n":"Stuttgart","c":"Germany","t":null,"s":16},"2498":{"n":"ColegioFDR_Peru","c":"Peru","t":"High School","s":17},"2499":{"n":"UNC-Asheville","c":"the United States","t":"Environment","s":6},"2500":{"n":"ETH_Zurich","c":"Switzerland","t":"Therapeutics","s":14},"2503":{"n":"RPI_Troy_NY","c":"the United States","t":"Therapeutics","s":16},"2504":{"n":"UPMC_PARIS","c":"France","t":null,"s":22},"2505":{"n":"TokyoTech","c":"Japan","t":"Information Processing","s":13},"2506":{"n":"CPU_CHINA","c":"China","t":"Therapeutics","s":14},"2507":{"n":"SHSBNU_China","c":"China","t":"High School","s":11},"2508":{"n":"Sheffield","c":"the United Kingdom","t":null,"s":11},"2509":{"n":"ASTWS-China","c":"China","t":"High School","s":13},"2510":{"n":"Paris_Bettencourt","c":"France","t":null,"s":15},"2511":{"n":"EpiphanyNYC","c":"the United States","t":"High School","s":3},"2512":{"n":"Worldshaper-XSHS","c":"China","t":"High School","s":14},"2513":{"n":"Worldshaper-Nanjing","c":"China","t":"High School","s":16},"2514":{"n":"Worldshaper-Wuhan","c":"China","t":"High School","s":10},"2515":{"n":"Bulgaria","c":"Bulgaria","t":null,"s":4},"2516":{"n":"NU_Kazakhstan","c":"Kazakhstan","t":"Environment","s":7},"2518":{"n":"Peshawar","c":"Pakistan","t":null,"s":16},"2519":{"n":"UST_Beijing","c":"China","t":"Food & Nutrition","s":39},"2520":{"n":"TECHNION-ISRAEL","c":"Israel","t":null,"s":15},"2522":{"n":"US_AFRL_CarrollHS","c":"the United States","t":"High School","s":20},"2523":{"n":"Florida_Atlantic","c":"the United States","t":"Software","s":14},"2524":{"n":"Georgia_State","c":"the United States","t":null,"s":15},"2525":{"n":"IIT_Delhi","c":"India","t":null,"s":2}};

// Export firebase function
exports.synbiobot = functions.https.onRequest((request, response) => {
	const app = new ApiAiApp({
		request: request,
		response: response
	});

	function getPart(app) {
		let url = 'https://parts.igem.org/cgi/xml/part.cgi?part=' + app.getArgument('iGEMPartName');

		getData(url, 'xml', function(data) {
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
			text += (part.part_type[0] ? '**Type:** ' + part.part_type[0] + '  \n' : '');
			text += (part.part_short_desc[0] ? '**Desc:** ' + part.part_short_desc[0] + '  \n' : '');
			text += (part.part_results[0] ? '**Results:** ' + part.part_results[0] + '  \n' : '');
			text += (part.release_status[0] ? '**Release status:** ' + part.release_status[0] + '  \n' : '');
			text += (part.sample_status[0] ? '**Availability:** ' + part.sample_status[0] + '  \n' : '');
			// Tidies the author field; trims excess whitespace and remove fullstop, if present.
			text += (part.part_author[0] ? '**Designed by:** ' + part.part_author[0].clean() + '  \n' : '');
			text += '  \nData provided by the iGEM registry';

			let destinationName = 'iGEM Registry';
			let suggestionUrl = (part.part_url[0] ? part.part_url[0] : 'https://parts.igem.org/Part:' + app.getArgument('iGEMPartName'));
			let suggestions = ['Search for another part', 'Exit'];

			// app.setContext('iGEM_part', 1, part);
			askWithBasicCardAndLinkAndSuggestions(speech, title, text, destinationName, suggestionUrl, suggestions);
		});
	}

	function getTeam(app) {
		let team = teamData[app.getArgument('iGEMTeamName')];

		let title = 'Team ' + team.n.replace(/[-_]/g, ' ');

		let speech = title + ' is an iGEM team from ' + team.c;
		speech += (team.t ? ' on the ' + team.t + ' track. ' : '. ');
		speech += (team.s ? 'They have ' + team.s + ' team mebers.' : '');

		let text = '';
		text += (team.n ? '**Name:** ' + team.n + '  \n' : '');
		text += (team.c ? '**Country:** ' + team.c.replace('the ', '') + '  \n' : '');
		text += (team.t ? '**Track:** ' + team.t + '  \n' : '');
		text += (team.s ? '**# Members:** ' + team.s + '  \n' : '');

		text += '  \nData sourced from iGEM';

		let destinationName = team.n.replace(/[-_]/g, ' ') + '\'s wiki';
		let suggestionUrl = '2017.igem.org/Team:' + team.n;
		let suggestions = ['Search for another team', 'Exit'];

		// app.setContext('iGEM_team', 1, team);
		askWithBasicCardAndLinkAndSuggestions(speech, title, text, destinationName, suggestionUrl, suggestions);
	}

	function protocatSearch(app) {
		// TODO: Use HTTPS
		// https://github.com/MiBioSoft2017/ProtoCat4/issues/17
		let url = 'http://protocat.org/api/protocol/?format=json';

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
			let results = (new fuseJs(data, searchOptions)).search(app.getRawInput());

			if (results.length == 0) {
				// No protocols found
				let speech = 'I couldn\'t find any protocols about ' + app.getRawInput() + ' on Protocat. What would you like me to do instead?';
				let suggestions = ['Search Protocat again', 'Find an iGEM Part', 'Go away'];
				askWithSimpleResponseAndSuggestions(speech, suggestions);
			} else if (results.length == 1) {
				// One protocol found
				showProtocol(results[0]);
			} else {
				// Multiple protocols found
				// Shows up to 10 results in a list
				let listOptions = [];
				for (let i = 0;
					(i < 10 && i < results.length); i++) {
					listOptions.push({
						selectionKey: results[i].id.toString(),
						title: results[i].title,
						description: results[i].description.clean().split('.')[0],
						synonyms: [results[i].title.split(/\s+/)[0], results[i].title.split(/\s+/).slice(0, 2).join(' ')]
					});
				}

				let speech = 'Which of these looks right?';

				if (!app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
					speech = 'Which of these sounds right? ';
					listOptions.forEach(function(option) {
						speech += option.title + '. ';
					});
				}

				askWithList(speech, 'Protocat results', listOptions);
			}
		});
	}

	function protocatListSelect(app) {
		// TODO: Use HTTPS
		// https://github.com/MiBioSoft2017/ProtoCat4/issues/17
		let url = 'http://protocat.org/api/protocol/' + app.getSelectedOption() + '/?format=json';

		getData(url, 'JSON', (data) => {
			// Check we actually got a protocol, and the right protocol
			if (data && data.title && data.id == app.getSelectedOption()) {
				showProtocol(data);
			} else {
				let speech = 'Sorry, I couldn\'t open that protocol. What should I do instead?';
				let suggestions = ['Search Protocat again', 'Find an iGEM Part', 'Go away'];
				askWithSimpleResponseAndSuggestions(speech, suggestions);
			}
		});
	}

	// Protocol must be in Protocat format
	function showProtocol(protocol) {
		// There's a lot of use of ternary operators to check if a piece of
		// data exists, as data is not guaranteed for every protocol.

		let title = protocol.title;
		let speech = '';
		speech += (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT) ? 'Here\'s the protocol you asked for. ' : 'Ok, I\'ve opened ' + protocol.title.clean() + '. ');
		speech += (protocol.description ? protocol.description.clean().split('.')[0] + '. ' : '');
		speech += 'Do you want a step-by-step guide, to search Protocat again or exit?';

		let text = '';
		text += (protocol.description.clean() ? '**Description:** ' + protocol.description.clean() + '  \n' : '');
		text += (protocol.materials.clean() ? '**Materials:** ' + protocol.materials.clean() + '  \n' : '');
		text += (protocol.protocol_steps ? '**# Steps:** ' + protocol.protocol_steps.length + '  \n' : '');
		text += '  \nData provided by Protocat';

		let destinationName = 'View on Protocat';
		// TODO: Use HTTPS
		let suggestionUrl = 'http://protocat.org/protocol/' + protocol.id.toString() + '/';
		let suggestions = ['Step-by-step guide', 'Search Protocat again', 'Exit'];

		app.setContext('protocol', 1, protocol);
		askWithBasicCardAndLinkAndSuggestions(speech, title, text, destinationName, suggestionUrl, suggestions);
	}

	function protocolStepByStepBegin(app) {
		let protocol = (app.getContext('protocol') ? app.getContext('protocol').parameters : {});
		if (protocol.protocol_steps) {
			let speech = 'Sure. Beginning the step-by-step instructions for ' + protocol.title + '. ';
			speech += 'To navigate through steps, just say \'next\', \'repeat\', or \'back\'. ';
			speech += (protocol.protocol_steps[0].warning.clean() ? 'Warning for step 1: ' + protocol.protocol_steps[0].warning.clean() + '.  \n  \n' : '');
			speech += 'Step 1: ' + protocol.protocol_steps[0].action.clean();

			let title = 'Step 1';

			let text = (protocol.protocol_steps[0].warning.clean() ? '**Warning for step 1:** ' + protocol.protocol_steps[0].warning.clean() + '. ' : '');
			text += 'Step 1: ' + protocol.protocol_steps[0].action.clean();

			let destinationName = 'View on Protocat';
			// TODO: Use HTTPS
			let suggestionUrl = 'http://protocat.org/protocol/' + protocol.id.toString() + '/';

			let suggestions = ['Next', 'Repeat'];

			// currentStep is 0 indexed, so steps[currentStep] works
			let protocol_step_state = {
				"steps": protocol.protocol_steps,
				"currentStep": 0,
				"id": protocol.id
			};
			app.setContext('protocol_step_state', 1, protocol_step_state);

			askWithBasicCardAndLinkAndSuggestions(speech, title, text, destinationName, suggestionUrl, suggestions);
		} else {
			askWithSimpleResponseAndSuggestions('You need to search for a protocol before getting instructions for it. What do you want to do now?', ['Search Protocat', 'Exit']);
		}
	}

	function protocolStepByStepMove(stepChange) {
		let protocol_step_state = (app.getContext('protocol_step_state') ? app.getContext('protocol_step_state').parameters : {});

		if (typeof protocol_step_state.currentStep == 'number') {
			let newCurrentStep = protocol_step_state.currentStep + stepChange;
			if (newCurrentStep > protocol_step_state.steps.length - 1) {
				// End instructions
				app.setContext('protocol_step_state', 1, protocol_step_state);
				askWithSimpleResponseAndSuggestions('There are no more steps in this guide. Do you want me to exit or repeat the last step?', ['Exit', 'Repeat', 'Search Protocat again', 'Search iGEM Registry']);
			} else if (newCurrentStep < 0) {
				// Not allowed to go back
				app.setContext('protocol_step_state', 1, protocol_step_state);
				askWithSimpleResponseAndSuggestions('You can\'t go back further than step 1! Would you like me to repeat step 1 or move on to step 2?', ['Repeat step 1', 'Move on to step 2']);
			} else {
				// Valid move
				protocol_step_state.currentStep = newCurrentStep;
				protocolStepByStepShow(protocol_step_state);
			}
		} else {
			if (app.getContext('protocol') ? app.getContext('protocol').parameters : false) {
				protocolStepByStepBegin(app);
			} else {
				askWithSimpleResponseAndSuggestions('You need to search for a protocol before getting instructions for it. What do you want to do now?', ['Search Protocat', 'Exit']);
			}
		}
	}

	function protocolStepByStepShow(protocol_step_state) {
		let step = protocol_step_state.steps[protocol_step_state.currentStep];

		let title = 'Step ' + step.step_number.toString();

		let speech = title + '. ';
		speech += (step.warning.clean() ? 'Warning: ' + step.warning.clean() + '. ' : '');
		// Regex replaces 'u' used to mean micro with actual micro
		speech += step.action.clean().replace(/([0-9]+)\s*u([lLg])+s*/g, '$1μ$2') + '. ';

		let nextStepPhrases = [
			'Want the next step now?',
			'Ready for the next step?',
			'Should I get the next step?',
			'Are you ready for the next step?',
			'Do you want the next step?',
			'Ready to go ahead?'
		];

		speech = '<speak><sub alias="' + speech + '">Sure. Here\'s that step. </sub>' + randomFromArray(nextStepPhrases) + '</speak>';

		let text = '';
		text += (step.warning.clean() ? '**Warning:** ' + step.warning.clean() + '.  \n  \n' : '');
		text += step.action.clean().replace(/([0-9]+)\s*u([lLg])+s*/g, '$1μ$2');

		let destinationName = 'View on Protocat';
		// TODO: Use HTTPS
		let suggestionUrl = 'http://protocat.org/protocol/' + protocol_step_state.id + '/#step' + step.step_number.toString();

		let suggestions = ['Next', 'Repeat', 'Back'];

		app.setContext('protocol_step_state', 1, protocol_step_state);
		askWithBasicCardAndLinkAndSuggestions(speech, title, text, destinationName, suggestionUrl, suggestions);
	}

	const actionMap = new Map();
	actionMap.set('get_part', getPart);

	actionMap.set('get_team', getTeam);

	actionMap.set('protocat_search', protocatSearch);
	actionMap.set('protocat_list_select', protocatListSelect);
	actionMap.set('protocol_step_by_step_begin', protocolStepByStepBegin);
	actionMap.set('protocol_step_by_step_next', () => {
		protocolStepByStepMove(1);
	});
	actionMap.set('protocol_step_by_step_repeat', () => {
		protocolStepByStepMove(0);
	});
	actionMap.set('protocol_step_by_step_back', () => {
		protocolStepByStepMove(-1);
	});
	app.handleRequest(actionMap);

	// All these helper methods pretty much do what they say on the tin,
	// just make it easier to create responses

	function askWithSimpleResponseAndSuggestions(speech, suggestions) {
		app.ask(app.buildRichResponse()
			.addSimpleResponse(speech)
			.addSuggestions(suggestions)
		);
	}

	function askWithList(speech, title, options) {
		let optionItems = [];
		options.forEach(function(option) {
			optionItems.push(app.buildOptionItem(option.selectionKey, option.synonyms).setTitle(option.title).setDescription(option.description));
		});

		app.askWithList(speech, app.buildList(title).addItems(optionItems));
	}

	function askWithBasicCardAndLinkAndSuggestions(speech, title, text, destinationName, suggestionUrl, suggestions) {
		app.ask(app.buildRichResponse()
			.addSimpleResponse(speech)
			.addBasicCard(app.buildBasicCard(text)
				.setTitle(title)
				.addButton(destinationName, suggestionUrl)
			)
			.addSuggestions(suggestions)
		);
	}

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
			askWithSimpleResponseAndSuggestions('There was an error connecting to the database. Please try again later. What would you like to do instead?', ['Search Parts Registry', 'Search Protocat', 'Exit']);
		});
	}
});

// Removes HTML tags, removes whitespace around string, removes trailing full stop
String.prototype.clean = function() {
	return this.replace(/<(?:.|\n)*?>/g, '').trim().replace(/\.$/, "");
};

// Useful for varying responses a bit
function randomFromArray(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
