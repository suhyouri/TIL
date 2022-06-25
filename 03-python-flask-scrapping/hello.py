from flask import Flask, redirect, render_template, request, send_file
from numpy import save
from scrapper import get_jobs 
from export import save_to_file

app = Flask("SuperScrapper")

db = {}


@app.route("/")
def home():
    return render_template("potato.html")

#dynamic url 
# @app.route("/<username>")
# def contact(username):
#     return f"Hello your name is {username}"


@app.route("/report")
def report():
    # print(request.args.get('word'))
    # return f"you're looking for job"
    word = request.args.get('word')
    if word:
        word = word.lower()
        existingJobs = db.get(word)
        if existingJobs:
            jobs = existingJobs
        else: 
            jobs = get_jobs(word)
            db[word] = jobs
        # print(jobs)
    else:
        redirect("/")
    # return f"you're looking for job in {word}"
    return render_template(
        "report.html", 
        searchingBy = word,
        resultsNumber = len(jobs),
        jobs=jobs
    )


@app.route("/export")
def export():
    try:
        word = request.args.get('word')
        if not word:
            raise Exception()
        word = word.lower()
        jobs = db.get(word)
        if not jobs:
            raise Exception()
        save_to_file(jobs)
        return send_file("jobs.csv")
    except:
        return redirect("/")

    

app.run(host="0.0.0.0")

