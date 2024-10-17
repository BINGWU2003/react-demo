<template>
  <div>
    <div class="padding text-center text-lg" style="font-weight: 600;color: #828282;" v-show="!companyList.length">
      <img style="width: 100%;height: 200px" src="@/assets/empty.png"></img>
      <p class="margin-tb-sm">您还没有加入公司</p>
      <p>请使用左上角扫一扫，扫描公司二维码申请加入或者搜索公司加入</p>
    </div>
    <div>
      <div class="cu-card" v-for="(item, i) in companyList" :key="i" v-show="companyList.length">
        <div class="cu-item cu-shadow">
          <div class="top" @click="toLogin(item.sysCompany.id, item.user.status)">
            <div class="left radius">
              <span class="icon-mes gongsijieshao text-white" style="font-size: 55px;"></span>
            </div>
            <div class="center">
              <div class="company-label">{{ item.sysCompany.name }}</div>
              <div class="cu-tag bg-orange radius padding-lr" v-show="item.sysCompany.vip_level">
                {{ item.sysCompany.vip_level }}级
              </div>
            </div>
            <div class="right">
              <div class="cu-tag bg-red" v-show="item.user.status == 10">已离职</div>
              <span class="cuIcon-roundright text-orange"></span>
            </div>
          </div>
          <div class="bottom">
            <span class="cuIcon-location text-orange margin-right-sm"></span>
            <span>{{ item.sysCompany.address ? item.sysCompany.address : '暂无' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { searchCompanies, loginCompany } from '@/axios/api/login'
import { register } from '@/axios/api/print'
import { useRouter } from 'vue-router'
import {user, client} from "@/utils/store";
import { useCollectLogs } from '@/hooks/collect-logs'
const { collectLogs } = useCollectLogs()
const router = useRouter()
const companyList = ref([])

function getJoinCompany() {
  searchCompanies().then(res => {
    companyList.value = res.data
  })
}

function toLogin(cid, status) {
  if (status == 10) {
    this.kit.toast('您已离职,已不能进入该公司')
    return
  }
  loginCompany(cid).then(async res => {
    user.cid = res.data.user.cid;
    user.token = res.data.token;
    user.id = res.data.user.id;
    user.username = res.data.authLoginUser.user_name;
    user.loginId = res.data.authLoginUser.login_id;
    try {
      await register({
        clientId: client.id
      })
      await collectLogs(`设备:${client.id}成功注册到服务端`)
      console.log(`设备:${client.id}成功注册到服务端`)
      router.push('/print')
    } catch (error) {
      console.log('error', error)
      await collectLogs(`设备:${client.id}注册到服务端失败`)
    }
  })
}

onMounted(() => {
  getJoinCompany()
})
</script>

<style scoped>
.cu-item {
  margin: 0 0 20px 0;
  padding: 10px;
}

.cu-shadow {
  border: 1px solid #eee;
}

.top {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.left {
  width: 75px;
  height: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: orange;
  margin-right: 10px;
}

.center {
  width: 55%;
  text-align: left;
}

.company-label {
  width: 100%;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.right {
  min-height: 100%;
  width: 55px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  font-size: 30px;
}

.bottom {
  text-align: left;
}
</style>