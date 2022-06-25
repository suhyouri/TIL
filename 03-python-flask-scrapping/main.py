import csv
from locale import currency
from indeed import get_jobs as get_indeed_jobs
from alba import get_jobs as get_alba_jobs
import os
# from save import save_to_file

import requests
from bs4 import BeautifulSoup

# indeed_jobs = get_indeed_jobs()
# jobs = indeed_jobs
# save_to_file(jobs_ind)
# print(indeed_jobs)

# alba_jobs = get_alba_jobs()
# jobs = alba_jobs
# print(alba_jobs)
# save_to_file(alba_jobs)

URL = f"http://www.alba.co.kr/"

places = []
titles = []
times = []
pays = []
dates = []
# names = []
num = 0
basket = []

# 1. extract urls
def extract_urls():
    urls = []
    result = requests.get(URL)
    soup = BeautifulSoup(result.text, "html.parser")
    result0 = soup.find_all("li", {"class": "impact"})
    # print(len(result0))
    for result in result0[0:3]:
        # print(f"result {result}")
        # title = result.find("span", {"class": "company"}).string
        # print(title)
        url = result.find("a")['href']
        # print(url)
        # print(title, url)
        urls.append(url)
        # names.append(title)
    max_page = urls[0:3]
    return urls
    ##save_to_file(job_final)

# 2. extract job info 
def extract_jobs(urls):
    jobs = []
    for url in urls:
        result = requests.get(url)
    # result = requests.get(urls[0])
        # print(result)
        soup = BeautifulSoup(result.text, "html.parser")
            
        tr = soup.find_all("tr", {"class":""})
        for i in tr:
            tr_place = soup.find("td", {"class": "local first"}).text
            # print(tr_place)
            tr_title = soup.find("td", {"class": "title"}).find("span", {"class": "company"}).string
            # print(tr_title)
            tr_time = soup.find("td", {"class": "data"}).find("span").string
            # print(tr_time)
            tr_pay_m = soup.find("td", {"class": "pay"}).find("span", {"class": "payIcon"}).string
            tr_pay = soup.find("td", {"class": "pay"}).find(
                "span", {"class": "number"}).string
            # print(tr_pay_m)
            # print(tr_pay)
            tr_pay_merge = tr_pay_m + tr_pay
            # print(tr_pay_merge)
            tr_date = soup.find("td", {"class": "regDate last"}).string
            # print(tr_date)
            final_all = {'place': tr_place, 'title': tr_title,
                        'time': tr_time, 'pay': tr_pay_merge, 'date': tr_date}
            # print('place:', tr_place, 'title:',
                #   tr_title, 'time:', tr_time, 'pay:',tr_pay_merge, 'date:',tr_date)
            # print(final_all)
            jobs.append(final_all)
    return jobs

# 3. merge exec
def get_info():
    extract_exec = extract_urls()
    jobs = extract_jobs(extract_exec)
    return jobs


pre_jobtitle = "job[0]['title']"
cur_jobtitle = ""

# 4. save to .csv
def save_to_file(jobs):
    # print(type(jobs)) # list
    # print(jobs[0]['title'])

    global cur_jobtitle
    global pre_jobtitle
    pre_jobtitle = cur_jobtitle
    cur_jobtitle = job['title']

    # 여기 경로를 바꿔야지..! 저장되는 file 경로가 달라지는 거니까
    file = open(f"{job[0]['title']}.csv", mode="w") 
    writer = csv.writer(file)
    writer.writerow(["place", "title", "time", "pay", "date"])
    path = os.path.exists(
        f"C:\\Users\\suhyouri\\Desktop\\python\\{cur_jobtitle}.csv")

    if(path):
        for job in jobs:
            writer.writerow(list(job.values()))
    else:
        file = open(f"{cur_jobtitle}.csv", mode="w")
        writer = csv.writer(file)
        writer.writerow(list(job.values()))
        # print(cur_jobtitle)
        #     file = open(f"{cur_jobtitle}.csv", mode="w")
        #     writer = csv.writer(file)
        #     writer.writerow(["place", "title", "time", "pay", "date"])
        #     writer.writerow(list(job.values()))
    return
    
    

# jobs = alba_jobs
# print(alba_jobs)
alba_jobs = get_info()
save_to_file(alba_jobs)
