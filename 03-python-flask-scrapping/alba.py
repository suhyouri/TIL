
import requests
from bs4 import BeautifulSoup

LIMIT = 50
URL = f"http://www.alba.co.kr/"


# def get_last_pages():
#     result = requests.get(URL)

#     soup = BeautifulSoup(result.text, "html.parser")

#     # pagination = soup.find("div", {"class": "pagination"})
#     pagination = soup.find("ul", {"class": "goodBox"})

#     links = pagination.find_all('a')
#     pages = []

#     for link in links[:-1]:
#         pages.append(int(link.string))

#     max_page = pages[-1]
#     return max_page


def extract_job(html):
    title = html.find("h2", {"class": "jobTitle"}).find(
        "span", title=True).string
    # print(title)
    company = html.find("span", {"class": "companyName"})
    if company:
        if company is not None:
            company = company.string
        else:
            company = None
    else:
        company = None
    location = str(html.find("div", {"class": "companyLocation"}).text)
    # print(location)
    job_id = html.find("h2", {"class": "jobTitle"}).find("a")["data-jk"]
    # print(job_id)
    return {'title': title, 'company': company, 'location': location, 'link': f"https://www.indeed.com/viewjob?jk={job_id}"}


def extract_jobs():
    jobs = []
    result = requests.get(URL)
    soup = BeautifulSoup(result.text, "html.parser")
    result0 = soup.find_all("div", {"ul": "goodBox"})
    print(result0)
    for result in result0:
        job = extract_job(result)
        jobs.append(job)
    return jobs


def get_jobs():
    # last_page = get_last_pages()
    # jobs = extract_jobs(last_page)
    jobs = extract_jobs()
    return jobs
