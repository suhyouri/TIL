
from indeed import get_jobs as get_indeed_jobs
from save import save_to_file

indeed_jobs = get_indeed_jobs()
jobs = indeed_jobs
save_to_file(jobs)
# print(indeed_jobs)