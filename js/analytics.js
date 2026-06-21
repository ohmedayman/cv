// QCV Analytics - Visit tracking, active users, time on site
(function(){
    const DB = 'https://qwcv-1cfad-default-rtdb.firebaseio.com';

    function genId(){
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2,8);
    }

    function trackVisit(){
        try{
            fetch(DB + '/analytics/visits.json', {
                method: 'PATCH',
                body: JSON.stringify({ [new Date().toISOString().slice(0,10)]: {'.sv': {'increment': 1}} })
            }).catch(()=>{});

            fetch(DB + '/analytics/totalVisits.json', {
                method: 'PUT',
                body: JSON.stringify({'.sv': {'increment': 1}})
            }).catch(()=>{});
        }catch(e){}
    }

    function trackActiveSession(){
        const sid = sessionStorage.getItem('qcv_session') || genId();
        sessionStorage.setItem('qcv_session', sid);

        const ref = DB + '/analytics/activeSessions/' + sid;
        const data = {
            page: location.pathname,
            start: Date.now(),
            lastSeen: Date.now()
        };

        fetch(ref + '.json', {
            method: 'PUT',
            body: JSON.stringify(data)
        }).catch(()=>{});

        const heartbeat = setInterval(()=>{
            fetch(ref + '/lastSeen.json', {
                method: 'PUT',
                body: JSON.stringify(Date.now())
            }).catch(()=>{});
        }, 30000);

        window.addEventListener('beforeunload', ()=>{
            clearInterval(heartbeat);
            fetch(ref + '.json', { method: 'DELETE' }).catch(()=>{});
        });
    }

    function trackTimeOnPage(){
        const start = Date.now();
        window.addEventListener('beforeunload', ()=>{
            const seconds = Math.floor((Date.now() - start) / 1000);
            if(seconds > 2){
                fetch(DB + '/analytics/timeOnSite.json', {
                    method: 'PATCH',
                    body: JSON.stringify({ [new Date().toISOString().slice(0,10)]: {'.sv': {'increment': seconds}} })
                }).catch(()=>{});
            }
        });
    }

    function trackPageView(){
        const page = location.pathname.split('/').pop() || 'index.html';
        fetch(DB + '/analytics/pageViews/' + page.replace(/\./g,'_') + '.json', {
            method: 'PATCH',
            body: JSON.stringify({ [new Date().toISOString().slice(0,10)]: {'.sv': {'increment': 1}} })
        }).catch(()=>{});
    }

    function cleanupSessions(){
        const cutoff = Date.now() - 60000;
        fetch(DB + '/analytics/activeSessions.json')
            .then(r=>r.json())
            .then(data=>{
                if(!data) return;
                const updates = {};
                Object.keys(data).forEach(k => {
                    if(data[k].lastSeen < cutoff) updates[k] = null;
                });
                if(Object.keys(updates).length > 0){
                    fetch(DB + '/analytics/activeSessions.json', {
                        method: 'PATCH',
                        body: JSON.stringify(updates)
                    }).catch(()=>{});
                }
            }).catch(()=>{});
    }

    trackVisit();
    trackActiveSession();
    trackTimeOnPage();
    trackPageView();
    cleanupSessions();

    window.QCVAnalytics = {
        getActiveCount: function(){
            return fetch(DB + '/analytics/activeSessions.json')
                .then(r=>r.json())
                .then(data => data ? Object.keys(data).length : 0)
                .catch(()=>0);
        },
        getTotalUsers: function(){
            return fetch(DB + '/users.json?shallow=true')
                .then(r=>r.json())
                .then(data => data ? Object.keys(data).length : 0)
                .catch(()=>0);
        },
        getVisits: function(date){
            const d = date || new Date().toISOString().slice(0,10);
            return fetch(DB + '/analytics/visits/' + d + '.json')
                .then(r=>r.json())
                .then(v => v || 0)
                .catch(()=>0);
        },
        getTotalVisits: function(){
            return fetch(DB + '/analytics/totalVisits.json')
                .then(r=>r.json())
                .then(v => v || 0)
                .catch(()=>0);
        },
        getPageViews: function(){
            return fetch(DB + '/analytics/pageViews.json')
                .then(r=>r.json())
                .then(data => {
                    if(!data) return {};
                    const totals = {};
                    Object.keys(data).forEach(page => {
                        totals[page] = Object.values(data[page]).reduce((a,b) => a + b, 0);
                    });
                    return totals;
                }).catch(()=>({}));
        },
        getTimeOnSite: function(date){
            const d = date || new Date().toISOString().slice(0,10);
            return fetch(DB + '/analytics/timeOnSite/' + d + '.json')
                .then(r=>r.json())
                .then(v => v || 0)
                .catch(()=>0);
        }
    };
})();
