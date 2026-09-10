const seedRequests = [
  { id: 1, title: "Send revised proposal to Acme Corp", details: "Incorporate the pricing changes from yesterday's call.", client: "Acme Corp", due: "2026-09-10", assignee: "Arjun Kapoor", priority: "high", status: "open", followUp: true, updated: 5 },
  { id: 2, title: "Confirm onboarding call agenda", details: "Share the final agenda and invite with the client team.", client: "Brightside", due: "2026-09-10", assignee: "Nisha Patel", priority: "high", status: "open", followUp: false, updated: 4 },
  { id: 3, title: "Fix login issue for Priya", details: "Client cannot access the reporting dashboard after reset.", client: "WhatsApp", due: "2026-09-11", assignee: "Arjun Kapoor", priority: "high", status: "open", followUp: true, updated: 3 },
  { id: 4, title: "Prepare October content calendar", details: "Draft topics and send for internal review.", client: "Northstar", due: "2026-09-15", assignee: "Rahul Mehta", priority: "medium", status: "open", followUp: false, updated: 2 },
  { id: 5, title: "Share analytics access with client", details: "Add the marketing team to the monthly reporting view.", client: "Email", due: "2026-09-16", assignee: "Arjun Kapoor", priority: "medium", status: "open", followUp: true, updated: 1 },
  { id: 6, title: "Review Q3 performance report", details: "Add notes before Friday's review meeting.", client: "Internal", due: "2026-09-18", assignee: "Nisha Patel", priority: "low", status: "open", followUp: false, updated: 0 },
  { id: 7, title: "Update vendor payment details", details: "Verify the new bank details against the signed form.", client: "Finance", due: "2026-09-19", assignee: "Rahul Mehta", priority: "medium", status: "open", followUp: false, updated: -1 },
  { id: 8, title: "Send launch checklist", details: "Final checklist shared with the product team.", client: "Acme Corp", due: "2026-09-08", assignee: "Arjun Kapoor", priority: "low", status: "open", followUp: false, updated: -2 }
];

const defaultTeam = ["Arjun Kapoor", "Nisha Patel", "Rahul Mehta"];
let requests = JSON.parse(localStorage.getItem("relay-requests") || "null") || seedRequests;
let teamMembers = JSON.parse(localStorage.getItem("relay-team") || "null") || defaultTeam;
requests.forEach(request => {
    if (request.status === "open") request.status = request.assignee ? "in_progress" : "ready_to_assign";
    if (request.assignee === "Unassigned") request.assignee = "";
});
let activeFilter = "all";
let view = "inbox";
const today = "2026-09-10";

const initials = name => name.split(" ").map(part => part[0]).join("").slice(0, 2);
const avatarClass = name => teamMembers.indexOf(name) === 1 ? "orange" : teamMembers.indexOf(name) === 2 ? "blue" : "purple";
const formatDate = date => new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const save = () => localStorage.setItem("relay-requests", JSON.stringify(requests));
const saveTeam = () => localStorage.setItem("relay-team", JSON.stringify(teamMembers));
const statusLabels = { needs_clarification: "Needs clarification", ready_to_assign: "Ready to assign", in_progress: "In progress", waiting_client: "Waiting on client", done: "Done" };
const activeRequests = () => requests.filter(request => request.status !== "done");
const isOverdue = request => request.status !== "done" && request.status !== "waiting_client" && request.due < today;

function renderTeam() {
    document.getElementById("teamMembers").innerHTML = teamMembers.map((member, index) => {
        const count = requests.filter(request => request.assignee === member && request.status !== "done").length;
        return `<div class="teammate"><i class="avatar ${["purple", "orange", "blue"][index]}">${initials(member)}</i><span>${member}</span><em>${count}</em></div>`;
    }).join("");
    const assigneeSelect = document.querySelector('select[name="assignee"]');
    assigneeSelect.innerHTML = `<option value="">Unassigned</option>${teamMembers.map(member => `<option>${member}</option>`).join("")}`;
}

function render() {
    if (view === "inbox") {
        document.getElementById("pageTitle").innerHTML = `शुभ दोपहर, ${teamMembers[0].split(" ")[0]} <span>✦</span>`;
    }
    document.getElementById("userAvatar").textContent = initials(teamMembers[0]);
    const search = document.getElementById("searchInput").value.toLowerCase();
    const filtered = requests.filter(request => {
        const matchesView = view === "done" ? request.status === "done" :
            view === "followups" ? request.followUp && request.status !== "done" :
            view === "waiting-us" ? ["needs_clarification", "ready_to_assign", "in_progress"].includes(request.status) :
            view === "waiting-client" ? request.status === "waiting_client" :
            view === "unassigned" ? !request.assignee && request.status !== "done" :
            view === "overdue" ? isOverdue(request) : request.status !== "done";
        const matchesFilter = activeFilter === "mine" ? request.assignee === teamMembers[0] : activeFilter === "high" ? request.priority === "high" : true;
        return matchesView && matchesFilter && `${request.title} ${request.details} ${request.client}`.toLowerCase().includes(search);
    }).sort((a, b) => {
        const sort = document.getElementById("sortSelect").value;
        if (sort === "due") return a.due.localeCompare(b.due);
        if (sort === "priority") return ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority]);
        return b.updated - a.updated;
    });
    document.getElementById("requestList").innerHTML = filtered.map(requestCard).join("");
    document.getElementById("emptyState").classList.toggle("hidden", filtered.length > 0);
    updateStats();
}

function requestCard(request) {
    const dueClass = isOverdue(request) ? "overdue" : "";
    const dueText = request.status === "waiting_client" ? "Paused · waiting on client" : isOverdue(request) ? "Overdue" : request.due === today ? "Due today" : `Due ${formatDate(request.due)}`;
    return `<article class="request-card ${request.status === "done" ? "is-done" : ""}">
        <button class="request-check" data-complete="${request.id}" aria-label="Mark request complete">${request.status === "done" ? "✓" : ""}</button>
        <div class="request-main"><h3 class="request-title">${request.title}</h3><p class="request-details">${request.details}</p><div class="meta"><span class="tag client">${request.client}</span><span class="tag ${request.priority}">${request.priority[0].toUpperCase() + request.priority.slice(1)}</span><span class="status-pill status-${request.status}">${statusLabels[request.status]}</span><span class="meta-date ${dueClass}">${dueText}</span>${request.followUp ? '<span class="followup-label">↻ Follow-up</span>' : ""}</div></div>
        <div class="assignee">${request.assignee ? `<i class="avatar ${avatarClass(request.assignee)}">${initials(request.assignee)}</i>${request.assignee.split(" ")[0]}` : '<span class="unassigned-label">Unassigned</span>'}</div>
        <div class="card-menu"><button data-follow="${request.id}" title="Toggle follow-up">${request.followUp ? "↻" : "◌"}</button><button data-delete="${request.id}" title="Delete request">•••</button></div>
        <select class="status-select" data-status="${request.id}" aria-label="Change request status">${Object.entries(statusLabels).map(([value, label]) => `<option value="${value}" ${value === request.status ? "selected" : ""}>${label}</option>`).join("")}</select>
    </article>`;
}

function updateStats() {
    const open = activeRequests();
    document.getElementById("openStat").textContent = open.length;
    document.getElementById("allCount").textContent = open.length;
    document.getElementById("navCount").textContent = open.length;
    document.getElementById("dueStat").textContent = open.filter(isOverdue).length;
    document.getElementById("followStat").textContent = open.filter(r => r.followUp).length;
    document.getElementById("followupCount").textContent = open.filter(r => r.followUp).length;
    document.getElementById("highCount").textContent = open.filter(r => r.priority === "high").length;
    document.getElementById("waitingUsCount").textContent = open.filter(r => ["needs_clarification", "ready_to_assign", "in_progress"].includes(r.status)).length;
    document.getElementById("waitingClientCount").textContent = open.filter(r => r.status === "waiting_client").length;
    document.getElementById("unassignedCount").textContent = open.filter(r => !r.assignee).length;
    document.getElementById("overdueCount").textContent = open.filter(isOverdue).length;
}

function setView(nextView) {
    view = nextView;
    document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.view === view));
    const titles = { "followups": "Follow-ups to chase <span>↻</span>", "done": "Completed work <span>✓</span>", "waiting-us": "Waiting for us <span>!</span>", "waiting-client": "Waiting on client <span>↻</span>", "unassigned": "Unassigned requests <span>○</span>", "overdue": "Overdue requests <span>!</span>" };
    document.getElementById("pageTitle").innerHTML = titles[view] || `शुभ दोपहर, ${teamMembers[0].split(" ")[0]} <span>✦</span>`;
    render();
}

document.addEventListener("click", event => {
    const complete = event.target.closest("[data-complete]");
    const follow = event.target.closest("[data-follow]");
    const remove = event.target.closest("[data-delete]");
    if (complete) { const request = requests.find(r => r.id === Number(complete.dataset.complete)); request.status = request.status === "done" ? "in_progress" : "done"; save(); renderTeam(); render(); }
    if (follow) { const request = requests.find(r => r.id === Number(follow.dataset.follow)); request.followUp = !request.followUp; save(); render(); }
    if (remove) { requests = requests.filter(r => r.id !== Number(remove.dataset.delete)); save(); render(); }
});
document.addEventListener("change", event => {
    const statusSelect = event.target.closest("[data-status]");
    if (!statusSelect) return;
    const request = requests.find(item => item.id === Number(statusSelect.dataset.status));
    request.status = statusSelect.value;
    save(); renderTeam(); render();
});
document.querySelectorAll(".nav-item").forEach(button => button.addEventListener("click", () => setView(button.dataset.view)));
document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => { activeFilter = tab.dataset.filter; document.querySelectorAll(".tab").forEach(item => item.classList.toggle("active", item === tab)); render(); }));
document.getElementById("searchInput").addEventListener("input", render);
document.getElementById("sortSelect").addEventListener("change", render);
const backdrop = document.getElementById("modalBackdrop");
document.getElementById("openFormButton").addEventListener("click", () => backdrop.classList.remove("hidden"));
document.getElementById("closeFormButton").addEventListener("click", () => backdrop.classList.add("hidden"));
backdrop.addEventListener("click", event => { if (event.target === backdrop) backdrop.classList.add("hidden"); });
document.getElementById("requestForm").addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(event.target);
    requests.unshift({ id: Date.now(), title: data.get("title"), details: data.get("details"), client: data.get("client"), due: data.get("due"), assignee: data.get("assignee"), priority: data.get("priority"), status: data.get("status"), followUp: false, updated: 10 });
    save(); event.target.reset(); backdrop.classList.add("hidden"); renderTeam(); setView("inbox");
});
const teamBackdrop = document.getElementById("teamModalBackdrop");
document.getElementById("editTeamButton").addEventListener("click", () => {
    const form = document.getElementById("teamForm");
    teamMembers.forEach((member, index) => { form.elements[`member${index + 1}`].value = member; });
    teamBackdrop.classList.remove("hidden");
});
document.getElementById("closeTeamButton").addEventListener("click", () => teamBackdrop.classList.add("hidden"));
teamBackdrop.addEventListener("click", event => { if (event.target === teamBackdrop) teamBackdrop.classList.add("hidden"); });
document.getElementById("teamForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.target);
    const nextTeam = [form.get("member1").trim(), form.get("member2").trim(), form.get("member3").trim()];
    const previousTeam = teamMembers;
    requests.forEach(request => {
        const previousIndex = previousTeam.indexOf(request.assignee);
        if (previousIndex >= 0) request.assignee = nextTeam[previousIndex];
    });
    teamMembers = nextTeam;
    saveTeam(); save(); renderTeam(); teamBackdrop.classList.add("hidden"); render();
});
renderTeam();
render();
